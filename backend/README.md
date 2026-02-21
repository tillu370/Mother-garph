# MotherSource AI - Backend

FastAPI backend for the MotherSource AI maternal health intelligence platform.

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your OPENAI_API_KEY and DATABASE_URL
```

### 3. Start PostgreSQL with pgvector

```bash
# Using Docker (recommended)
docker run -d \
  --name mothersource_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mothersource \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

### 4. Run the API

```bash
uvicorn app.main:app --reload
```

API will be available at: http://localhost:8000

API Docs: http://localhost:8000/docs

### 5. Seed Sample Data

```bash
curl -X POST http://localhost:8000/seed
```

## Using Docker Compose

```bash
cd backend
docker-compose up -d
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /stats | Dashboard statistics |
| POST | /ingest | Ingest new entity |
| POST | /classify | AI entity classification |
| POST | /score | AI relevance scoring |
| POST | /search | Search entities with filters |
| GET | /ngos | List NGOs |
| POST | /match-ngos | Match NGOs by program (embeddings) |
| GET | /funders | List funders |
| GET | /priority-ranking | Priority-ranked entities |
| POST | /generate-email | AI email generation |
| GET | /heatmap | District heatmap data |
| POST | /seed | Seed sample data |

## Environment Variables

```env
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=postgresql://postgres:password@localhost:5432/mothersource
```
