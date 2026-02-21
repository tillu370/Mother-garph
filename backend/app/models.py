from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector

Base = declarative_base()


class Entity(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(500), nullable=False, index=True)
    type = Column(String(100))
    district = Column(String(200))
    state = Column(String(100))
    address = Column(Text)
    website = Column(String(500))
    email = Column(String(300))
    phone = Column(String(50))
    description = Column(Text)
    embedding = Column(Vector(1536))
    relevance_score = Column(Float, default=0.0)
    priority_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(500), nullable=False, index=True)
    district = Column(String(200))
    state = Column(String(100))
    focus_areas = Column(ARRAY(String))
    website = Column(String(500))
    description = Column(Text)
    embedding = Column(Vector(1536))
    alignment_score = Column(Float, default=0.0)


class Funder(Base):
    __tablename__ = "funders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(500), nullable=False, index=True)
    type = Column(String(100))
    focus_areas = Column(ARRAY(String))
    grant_size = Column(String(100))
    geography = Column(String(200))
    website = Column(String(500))
    description = Column(Text)
    embedding = Column(Vector(1536))
    relevance_score = Column(Float, default=0.0)
