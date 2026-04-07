"""
AI Travel Planner — FastAPI ML Server
Serves cost predictions via REST API.

Endpoints:
  POST /predict  — Predict trip cost
  GET  /health   — Health check
  GET  /model-info — Model metadata

Run:
  uvicorn app:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import json
import os

app = FastAPI(
    title="TravelGenius ML API",
    description="Cost prediction API for AI Travel Planner",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'model.pkl')
METADATA_PATH = os.path.join(os.path.dirname(__file__), 'models', 'metadata.json')

model_data = None
metadata = None

def load_model():
    global model_data, metadata
    if os.path.exists(MODEL_PATH):
        model_data = joblib.load(MODEL_PATH)
        print("✅ Model loaded successfully")
    else:
        print("⚠️  Model not found. Run: python train_model.py")

    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH) as f:
            metadata = json.load(f)

load_model()


# Request/Response schemas
class PredictRequest(BaseModel):
    source_city: str = Field(..., example="Delhi")
    destination_city: str = Field(..., example="Manali")
    travel_mode: str = Field(..., example="train")
    num_days: int = Field(..., ge=1, le=30, example=5)
    hotel_type: str = Field(default="3-star", example="3-star")
    group_size: int = Field(default=1, ge=1, le=20, example=4)
    season: str = Field(default="summer", example="summer")
    activity_level: str = Field(default="moderate", example="moderate")
    food_preference: str = Field(default="mixed", example="mixed")


class PredictResponse(BaseModel):
    total_cost: float
    per_person: float
    breakdown: dict
    season: str
    confidence: float
    source: str


def encode_feature(column, value):
    """Safely encode a categorical value, defaulting to 0 if unknown."""
    if model_data and column in model_data['label_encoders']:
        le = model_data['label_encoders'][column]
        if value in le.classes_:
            return le.transform([value])[0]
    return 0


def get_distance(source, destination):
    """Approximate distance lookup."""
    distances = {
        ('delhi', 'manali'): 530, ('delhi', 'goa'): 1900, ('delhi', 'jaipur'): 280,
        ('delhi', 'shimla'): 350, ('delhi', 'ladakh'): 1000, ('delhi', 'rishikesh'): 240,
        ('delhi', 'agra'): 230, ('delhi', 'varanasi'): 800, ('delhi', 'udaipur'): 660,
        ('mumbai', 'goa'): 590, ('mumbai', 'jaipur'): 1150, ('mumbai', 'udaipur'): 800,
        ('bangalore', 'goa'): 560, ('bangalore', 'kerala'): 600, ('bangalore', 'ooty'): 270,
        ('bangalore', 'munnar'): 480, ('chennai', 'kerala'): 700, ('kolkata', 'darjeeling'): 600,
    }
    key = (source.lower(), destination.lower())
    rev_key = (destination.lower(), source.lower())
    return distances.get(key, distances.get(rev_key, 1000))


@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    if model_data is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run: python train_model.py")

    try:
        distance = get_distance(request.source_city, request.destination_city)

        features = np.array([[
            encode_feature('source_city', request.source_city.capitalize()),
            encode_feature('destination_city', request.destination_city.capitalize()),
            distance,
            encode_feature('travel_mode', request.travel_mode),
            encode_feature('season', request.season),
            request.num_days,
            encode_feature('hotel_type', request.hotel_type),
            encode_feature('activity_level', request.activity_level),
            encode_feature('food_preference', request.food_preference),
            request.group_size,
        ]])

        # Scale features
        features_scaled = model_data['scaler'].transform(features)

        # Predict total
        total_cost = float(model_data['total_model'].predict(features_scaled)[0])

        # Predict breakdown
        breakdown = {}
        for key, model in model_data['breakdown_models'].items():
            breakdown[key.replace('_cost', '')] = round(float(model.predict(features_scaled)[0]))

        per_person = round(total_cost / request.group_size)

        return PredictResponse(
            total_cost=round(total_cost),
            per_person=per_person,
            breakdown=breakdown,
            season=request.season,
            confidence=model_data['metrics']['r2'],
            source='ml_model',
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/health")
async def health():
    return {
        "status": "healthy" if model_data else "model_not_loaded",
        "model_loaded": model_data is not None,
    }


@app.get("/model-info")
async def model_info():
    if metadata is None:
        return {"message": "No metadata available"}
    return metadata


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
