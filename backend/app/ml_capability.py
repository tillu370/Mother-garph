import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_training_data():
    """
    Hackathon trick: Auto-labeling data based on keywords to train our model.
    In production, this would be labeled by human experts.
    """
    logger.info("Loading Data & Embeddings for Training...")
    
    # Load Data
    ngos = pd.read_csv('data/ngos_300.csv')
    ngo_embeddings = np.load('data/ngo_embeddings.npy')
    
    facilities = pd.read_csv('data/facilities_200.csv')
    fac_embeddings = np.load('data/facility_embeddings.npy')
    
    # Auto-labeling logic (1 = High Capability for Maternal Health, 0 = Low)
    target_keywords = ['maternal', 'neonatal', 'ob-gyn', 'pregnancy', 'delivery', 'midwife', 'icu']
    
    ngo_labels = ngos['description'].fillna('').str.lower().apply(
        lambda x: 1 if any(word in str(x) for word in target_keywords) else 0
    ).values
    
    fac_labels = facilities['services_text'].fillna('').str.lower().apply(
        lambda x: 1 if any(word in str(x) for word in target_keywords) else 0
    ).values
    
    # Combine data to train one unified classifier
    X_train = np.vstack((ngo_embeddings, fac_embeddings))
    y_train = np.concatenate((ngo_labels, fac_labels))
    
    return X_train, y_train, ngos, facilities, ngo_embeddings, fac_embeddings

def train_and_score():
    X_train, y_train, ngos, facilities, ngo_embeddings, fac_embeddings = create_training_data()
    
    logger.info("Training Random Forest Classifier...")
    # Train the model
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    # Save the model so we don't have to retrain it every API call
    joblib.dump(clf, 'data/capability_model.pkl')
    logger.info("✅ Model trained and saved as data/capability_model.pkl")
    
    # Optional: Generate scores for everything right now so our API is super fast
    logger.info("Generating scores for all entities...")
    
    # predict_proba returns probability [class_0, class_1]. We want class_1 (High Capability)
    ngo_scores = clf.predict_proba(ngo_embeddings)[:, 1]
    fac_scores = clf.predict_proba(fac_embeddings)[:, 1]
    
    # Save the scores back to the CSVs so they are easy to load
    ngos['capability_score'] = np.round(ngo_scores * 100, 2)
    facilities['capability_score'] = np.round(fac_scores * 100, 2)
    
    ngos.to_csv('data/ngos_scored.csv', index=False)
    facilities.to_csv('data/facilities_scored.csv', index=False)
    
    logger.info("✅ Scored CSVs saved! Backend is ready to serve data.")

if __name__ == "__main__":
    train_and_score()
