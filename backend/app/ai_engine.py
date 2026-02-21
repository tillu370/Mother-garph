import os
import json
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_embedding(text: str) -> list[float]:
    """Generate 1536-dimensional embedding using OpenAI text-embedding-ada-002."""
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text[:8000],  # Truncate to avoid token limits
    )
    return response.data[0].embedding


def classify_entity(description: str) -> dict:
    """
    Classify an organization into a predefined type using GPT-4.
    Returns: { type, confidence, reasoning }
    """
    prompt = f"""You are an expert in Indian healthcare and maternal health organizations.

Classify the following organization description into ONE of these categories:
- PHC (Primary Health Centre)
- Government Hospital
- Private Hospital
- Medical College
- NGO
- Corporate
- Funder

Organization Description:
{description}

Return a JSON object with exactly these fields:
{{
  "type": "<category>",
  "confidence": <integer 0-100>,
  "reasoning": "<2-3 sentence explanation>"
}}

Return ONLY the JSON, no other text."""

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=300,
    )

    result = json.loads(response.choices[0].message.content.strip())
    return result


def score_entity(description: str, entity_type: str, district: str) -> dict:
    """
    Score entity relevance for maternal health pilot.
    Returns: { score, reasoning }
    """
    prompt = f"""You are evaluating organizations for a maternal health outreach pilot in Andhra Pradesh and Telangana, India.

Score this organization's relevance for a maternal health partnership (0-100).

Organization Details:
- Type: {entity_type}
- District: {district}
- Description: {description}

Scoring Factors:
1. Maternal health services offered
2. Women-focused programs
3. Community outreach capability
4. Geographic alignment (AP/Telangana focus)
5. Scale and patient base

Return JSON:
{{
  "score": <integer 0-100>,
  "reasoning": ["reason 1", "reason 2", "reason 3", "reason 4"]
}}

Return ONLY the JSON."""

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=400,
    )

    result = json.loads(response.choices[0].message.content.strip())
    return result


def generate_email(organization_name: str, org_type: str) -> dict:
    """
    Generate a professional outreach email for a maternal health partnership.
    Returns: { subject, body }
    """
    type_context = {
        "Private Hospital": "a private hospital specializing in women and children's health",
        "Government Hospital": "a government hospital serving the public",
        "Medical College": "a medical college with hospital facilities",
        "PHC": "a primary health centre serving rural communities",
        "NGO": "an NGO working on maternal and child health",
        "Funder": "a foundation/funder interested in maternal health programs",
        "Corporate": "a corporate entity with CSR programs in healthcare",
    }.get(org_type, "a healthcare organization")

    prompt = f"""Write a professional outreach email for a maternal health partnership.

Sender: MotherSource AI (maternal health intelligence platform for AP & Telangana)
Recipient: {organization_name} - {type_context}
Purpose: Partnership for maternal health outreach program in Andhra Pradesh and Telangana

Requirements:
- Professional and warm tone
- Mention specific value propositions
- Include clear call-to-action
- 3-4 bullet points of benefits
- Reference specific AP/Telangana context
- 250-350 words

Return JSON:
{{
  "subject": "<email subject line>",
  "body": "<full email body with greeting, paragraphs, bullet points, and signature>"
}}

Return ONLY the JSON."""

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=800,
    )

    result = json.loads(response.choices[0].message.content.strip())
    return result


def match_ngos_by_embedding(program_text: str, ngo_embeddings: list[tuple]) -> list[int]:
    """
    Match NGOs by semantic similarity using cosine similarity.
    ngo_embeddings: list of (ngo_id, embedding)
    Returns: sorted list of ngo_ids by similarity
    """
    import numpy as np

    program_embedding = generate_embedding(program_text)
    program_vec = np.array(program_embedding)

    similarities = []
    for ngo_id, embedding in ngo_embeddings:
        if embedding is None:
            continue
        ngo_vec = np.array(embedding)
        # Cosine similarity
        sim = np.dot(program_vec, ngo_vec) / (np.linalg.norm(program_vec) * np.linalg.norm(ngo_vec))
        similarities.append((ngo_id, float(sim)))

    similarities.sort(key=lambda x: x[1], reverse=True)
    return [ngo_id for ngo_id, _ in similarities[:10]]


def check_duplicate(new_embedding: list[float], existing_embeddings: list[tuple], threshold: float = 0.92) -> Optional[int]:
    """
    Check if a new entity is a duplicate based on embedding similarity.
    Returns entity_id if duplicate found, else None.
    """
    import numpy as np

    new_vec = np.array(new_embedding)
    for entity_id, embedding in existing_embeddings:
        if embedding is None:
            continue
        existing_vec = np.array(embedding)
        sim = np.dot(new_vec, existing_vec) / (np.linalg.norm(new_vec) * np.linalg.norm(existing_vec))
        if sim > threshold:
            return entity_id
    return None
