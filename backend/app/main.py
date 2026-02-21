import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import pandas as pd

# Files are in app/data relative to the backend root where uvicorn runs
NGO_SCORED = pd.read_csv("app/data/ngos_scored.csv")
FAC_SCORED = pd.read_csv("app/data/facilities_scored.csv")

load_dotenv()

from .database import get_db, init_db
from .models import Entity, NGO, Funder
from . import ai_engine
from .data_sources import SEED_ENTITIES, SEED_NGOS, SEED_FUNDERS

app = FastAPI(
    title="MotherSource AI API",
    description="AI-Powered Maternal Health Outreach & Funding Intelligence",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
async def startup_event():
    try:
        init_db()
        print("MotherSource AI API started successfully.")
    except Exception as e:
        print(f"DB init warning: {e}")


# ─── Pydantic Schemas ─────────────────────────────────────────────────────────

class IngestRequest(BaseModel):
    name: str
    website: Optional[str] = None
    description: str
    type: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = "Andhra Pradesh"
    email: Optional[str] = None
    phone: Optional[str] = None


class ClassifyRequest(BaseModel):
    description: str


class ScoreRequest(BaseModel):
    entity_id: int


class SearchRequest(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    type: Optional[str] = None
    query: Optional[str] = None


class MatchNGORequest(BaseModel):
    program_description: str


class EmailRequest(BaseModel):
    organization_name: str
    type: str


# ─── Health Check ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "MotherSource AI API", "status": "running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}


# ─── Stats ────────────────────────────────────────────────────────────────────

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_entities = db.query(Entity).count()
    total_ngos = db.query(NGO).count()
    total_funders = db.query(Funder).count()
    high_priority = db.query(Entity).filter(Entity.priority_score >= 85).count()

    # By type
    type_counts = {}
    for entity in db.query(Entity).all():
        type_counts[entity.type] = type_counts.get(entity.type, 0) + 1

    # By district
    district_counts = {}
    for entity in db.query(Entity).all():
        if entity.district:
            district_counts[entity.district] = district_counts.get(entity.district, 0) + 1

    return {
        "total_entities": total_entities,
        "total_ngos": total_ngos,
        "total_funders": total_funders,
        "high_priority_leads": high_priority,
        "by_type": type_counts,
        "by_district": district_counts,
    }


# ─── Ingest ───────────────────────────────────────────────────────────────────

@app.post("/ingest")
def ingest_entity(req: IngestRequest, db: Session = Depends(get_db)):
    """Ingest a new entity: extract text, generate embedding, classify, store."""
    # Generate embedding
    text_for_embedding = f"{req.name}. {req.description}"
    try:
        embedding = ai_engine.generate_embedding(text_for_embedding)
    except Exception:
        embedding = None

    # Check for duplicates
    if embedding:
        existing = db.query(Entity).filter(Entity.embedding.isnot(None)).all()
        existing_embeddings = [(e.id, e.embedding) for e in existing if e.embedding is not None]
        duplicate_id = ai_engine.check_duplicate(embedding, existing_embeddings)
        if duplicate_id:
            raise HTTPException(status_code=409, detail=f"Duplicate entity detected (similar to entity {duplicate_id})")

    # Classify entity type if not provided
    entity_type = req.type
    if not entity_type:
        try:
            classification = ai_engine.classify_entity(req.description)
            entity_type = classification["type"]
        except Exception:
            entity_type = "Private Hospital"

    # Score entity
    try:
        score_result = ai_engine.score_entity(req.description, entity_type, req.district or "")
        relevance_score = score_result["score"]
    except Exception:
        relevance_score = 70.0

    # Calculate priority score
    priority_score = (0.5 * relevance_score) + (0.3 * 75) + (0.2 * 70)

    entity = Entity(
        name=req.name,
        type=entity_type,
        district=req.district,
        state=req.state,
        website=req.website,
        email=req.email,
        phone=req.phone,
        description=req.description,
        embedding=embedding,
        relevance_score=relevance_score,
        priority_score=priority_score,
    )
    db.add(entity)
    db.commit()
    db.refresh(entity)
    return entity


# ─── Classify ─────────────────────────────────────────────────────────────────

@app.post("/classify")
def classify_entity(req: ClassifyRequest):
    """Classify an organization description using GPT-4."""
    try:
        result = ai_engine.classify_entity(req.description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Score ────────────────────────────────────────────────────────────────────

@app.post("/score")
def score_entity(req: ScoreRequest, db: Session = Depends(get_db)):
    """Score an entity's relevance for maternal health pilot."""
    entity = db.query(Entity).filter(Entity.id == req.entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")

    try:
        result = ai_engine.score_entity(
            entity.description or "",
            entity.type or "",
            entity.district or "",
        )
        # Update score in DB
        entity.relevance_score = result["score"]
        entity.priority_score = (0.5 * result["score"]) + (0.3 * 75) + (0.2 * 70)
        db.commit()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Search ───────────────────────────────────────────────────────────────────

@app.post("/search")
def search_entities(req: SearchRequest, db: Session = Depends(get_db)):
    """Search entities with filters, sorted by relevance score."""
    query = db.query(Entity)

    if req.state:
        query = query.filter(Entity.state == req.state)
    if req.district:
        query = query.filter(Entity.district.ilike(f"%{req.district}%"))
    if req.type:
        query = query.filter(Entity.type == req.type)
    if req.query:
        query = query.filter(
            Entity.name.ilike(f"%{req.query}%") |
            Entity.description.ilike(f"%{req.query}%")
        )

    entities = query.order_by(Entity.relevance_score.desc()).all()
    return entities


# ─── NGOs ─────────────────────────────────────────────────────────────────────

@app.get("/ngos")
def get_ngos(query: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all NGOs, optionally filtered by query."""
    q = db.query(NGO)
    if query:
        q = q.filter(
            NGO.name.ilike(f"%{query}%") |
            NGO.description.ilike(f"%{query}%")
        )
    return q.order_by(NGO.alignment_score.desc()).all()


@app.post("/match-ngos")
def match_ngos(req: MatchNGORequest, db: Session = Depends(get_db)):
    """Match NGOs to a program using embedding similarity."""
    ngos = db.query(NGO).all()

    if not ngos:
        return []

    try:
        ngo_embeddings = [(n.id, n.embedding) for n in ngos if n.embedding is not None]
        if ngo_embeddings:
            ranked_ids = ai_engine.match_ngos_by_embedding(req.program_description, ngo_embeddings)
            ngo_map = {n.id: n for n in ngos}
            return [ngo_map[ngo_id] for ngo_id in ranked_ids if ngo_id in ngo_map]
    except Exception:
        pass

    # Fallback: return by alignment score
    return sorted(ngos, key=lambda n: n.alignment_score, reverse=True)[:10]


# ─── Funders ──────────────────────────────────────────────────────────────────

@app.get("/funders")
def get_funders(
    type: Optional[str] = None,
    geography: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Funder)
    if type:
        q = q.filter(Funder.type == type)
    if geography:
        q = q.filter(Funder.geography.ilike(f"%{geography}%"))
    return q.order_by(Funder.relevance_score.desc()).all()


# ─── Entities ─────────────────────────────────────────────────────────────────

@app.get("/entities/{entity_id}")
def get_entity(entity_id: int, db: Session = Depends(get_db)):
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


# ─── Priority Ranking ─────────────────────────────────────────────────────────

@app.get("/priority-ranking")
def get_priority_ranking():
    """
    Returns a unified list of top entities (NGOs + Facilities)
    sorted by composite priority score.
    """
    rows = []

    for _, r in NGO_SCORED.iterrows():
        rows.append({
            "name": str(r.get("name", "")),
            "type": "NGO",
            "district": str(r.get("district", "")),
            "state": str(r.get("state", "")),
            "relevancescore": float(r.get("capability_score", 0.0)),
            "priorityscore": float(r.get("capability_score", 0.0)),
        })

    for _, r in FAC_SCORED.iterrows():
        rows.append({
            "name": str(r.get("name", "")),
            "type": str(r.get("type", "Facility")),
            "district": str(r.get("district", "")),
            "state": "Andhra Pradesh",  # simple default
            "relevancescore": float(r.get("capability_score", 0.0)),
            "priorityscore": float(r.get("capability_score", 0.0)),
        })

    rows = sorted(rows, key=lambda r: r["priorityscore"], reverse=True)[:50]
    return rows


# ─── Email Generation ─────────────────────────────────────────────────────────

@app.post("/generate-email")
def generate_email(req: EmailRequest):
    """Generate a professional outreach email using GPT-4."""
    try:
        result = ai_engine.generate_email(req.organization_name, req.type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Heatmap ──────────────────────────────────────────────────────────────────

@app.get("/heatmap")
def get_heatmap(db: Session = Depends(get_db)):
    """Return district-wise entity count for heatmap."""
    DISTRICT_COORDS = {
        "Visakhapatnam": (17.6868, 83.2185),
        "Hyderabad": (17.3850, 78.4867),
        "Guntur": (16.3067, 80.4365),
        "Krishna": (16.6100, 80.7214),
        "Rangareddy": (17.2543, 78.3808),
        "East Godavari": (17.0005, 81.8040),
        "Eluru": (16.7107, 81.0952),
        "Karimnagar": (18.4386, 79.1288),
        "Nellore": (14.4426, 79.9865),
        "Kurnool": (15.8281, 78.0373),
        "Warangal": (17.9784, 79.5941),
        "Nizamabad": (18.6725, 78.0941),
    }

    district_counts: dict = {}
    for entity in db.query(Entity).all():
        if entity.district:
            district_counts[entity.district] = district_counts.get(entity.district, 0) + 1

    result = []
    for district, count in district_counts.items():
        coords = DISTRICT_COORDS.get(district, (17.0, 80.0))
        result.append({
            "district": district,
            "count": count,
            "lat": coords[0],
            "lng": coords[1],
        })

    return sorted(result, key=lambda x: x["count"], reverse=True)


# ─── Seed Data ────────────────────────────────────────────────────────────────

@app.post("/seed")
def seed_data(db: Session = Depends(get_db)):
    """Seed database with sample entities, NGOs, and funders."""
    # Check if already seeded
    if db.query(Entity).count() > 0:
        return {"message": "Database already seeded", "count": db.query(Entity).count()}

    # Seed entities
    for data in SEED_ENTITIES:
        entity = Entity(**data)
        db.add(entity)

    # Seed NGOs
    for data in SEED_NGOS:
        ngo = NGO(**data)
        db.add(ngo)

    # Seed funders
    for data in SEED_FUNDERS:
        funder = Funder(**data)
        db.add(funder)

    db.commit()
    return {
        "message": "Seeded successfully",
        "entities": len(SEED_ENTITIES),
        "ngos": len(SEED_NGOS),
        "funders": len(SEED_FUNDERS),
    }
@app.get("/priority-ranking")
def get_priority_ranking():
    """
    Returns a unified list of top entities (NGOs + Facilities)
    sorted by composite priority score.
    """
    rows = []

    for _, r in NGO_SCORED.iterrows():
        rows.append({
            "name": str(r.get("name", "")),
            "type": "NGO",
            "district": str(r.get("district", "")),
            "state": str(r.get("state", "")),
            "relevance_score": float(r.get("capability_score", 0.0)),
            "priority_score": float(r.get("capability_score", 0.0)),
        })

    for _, r in FAC_SCORED.iterrows():
        rows.append({
            "name": str(r.get("name", "")),
            "type": str(r.get("type", "Facility")),
            "district": str(r.get("district", "")),
            "state": "Andhra Pradesh",  # simple default
            "relevance_score": float(r.get("capability_score", 0.0)),
            "priority_score": float(r.get("capability_score", 0.0)),
        })

    rows = sorted(rows, key=lambda r: r["priority_score"], reverse=True)[:50]
    return rows
