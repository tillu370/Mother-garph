import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_NAME = 'all-MiniLM-L6-v2'

def generate_embeddings():
    logger.info(f"Loading ML Model: {MODEL_NAME}...")
    model = SentenceTransformer(MODEL_NAME)
    
    # Process NGOs
    logger.info("Loading NGO data...")
    ngos = pd.read_csv('data/ngos_300.csv')
    ngo_texts = (ngos['focus_areas'].fillna('') + " " + ngos['description'].fillna('')).tolist()
    logger.info("Embedding NGOs...")
    ngo_embeddings = model.encode(ngo_texts, show_progress_bar=True)
    np.save('data/ngo_embeddings.npy', ngo_embeddings)
    
    # Process Facilities
    logger.info("Loading Facilities data...")
    facilities = pd.read_csv('data/facilities_200.csv')
    fac_texts = (facilities['type'].fillna('') + " " + facilities['services_text'].fillna('')).tolist()
    logger.info("Embedding Facilities...")
    fac_embeddings = model.encode(fac_texts, show_progress_bar=True)
    np.save('data/facility_embeddings.npy', fac_embeddings)
    
    # Process Funders
    logger.info("Loading Funders data...")
    funders = pd.read_csv('data/funders.csv')
    funder_texts = (funders['focus_areas'].fillna('') + " " + funders['description'].fillna('')).tolist()
    logger.info("Embedding Funders...")
    funder_embeddings = model.encode(funder_texts, show_progress_bar=True)
    np.save('data/funder_embeddings.npy', funder_embeddings)
    
    logger.info("✅ All embeddings generated and saved to data/ folder.")

if __name__ == "__main__":
    generate_embeddings()
