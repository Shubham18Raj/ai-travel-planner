"""
AI Travel Planner — ML Cost Prediction Model
Trains a RandomForest model on synthetic Indian travel data.

Usage:
  python train_model.py

Output:
  models/model.pkl — Trained model
  models/scaler.pkl — Feature scaler
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os
import json

# ==================== GENERATE SYNTHETIC DATASET ====================

def generate_dataset(n_samples=5000):
    np.random.seed(42)

    cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Lucknow', 'Chandigarh']
    destinations = ['Manali', 'Goa', 'Jaipur', 'Kerala', 'Shimla', 'Ladakh', 'Udaipur', 'Darjeeling', 'Rishikesh', 'Andaman', 'Varanasi', 'Ooty', 'Agra', 'Munnar', 'Jaisalmer']
    travel_modes = ['bus', 'train', 'flight', 'car']
    seasons = ['summer', 'monsoon', 'autumn', 'winter']
    hotel_types = ['hostel', 'budget', '3-star', '4-star', '5-star']
    activity_levels = ['low', 'moderate', 'high']
    food_preferences = ['budget', 'mixed', 'luxury']

    # Distance lookup (approximate km)
    distance_map = {
        'Manali': {'Delhi': 530, 'Mumbai': 1900, 'Bangalore': 2600, 'Chennai': 2800, 'Kolkata': 1900, 'default': 1500},
        'Goa': {'Delhi': 1900, 'Mumbai': 590, 'Bangalore': 560, 'Chennai': 880, 'Kolkata': 1900, 'default': 1000},
        'Jaipur': {'Delhi': 280, 'Mumbai': 1150, 'Bangalore': 1900, 'Chennai': 1800, 'Kolkata': 1500, 'default': 1000},
        'Kerala': {'Delhi': 2700, 'Mumbai': 1400, 'Bangalore': 600, 'Chennai': 700, 'Kolkata': 2500, 'default': 1500},
        'Shimla': {'Delhi': 350, 'Mumbai': 1900, 'Bangalore': 2500, 'Chennai': 2700, 'Kolkata': 1800, 'default': 1400},
        'Ladakh': {'Delhi': 1000, 'Mumbai': 2500, 'Bangalore': 3200, 'Chennai': 3400, 'Kolkata': 2500, 'default': 2200},
        'Udaipur': {'Delhi': 660, 'Mumbai': 800, 'Bangalore': 1600, 'Chennai': 1700, 'Kolkata': 1700, 'default': 1100},
        'Darjeeling': {'Delhi': 1500, 'Mumbai': 2000, 'Bangalore': 2200, 'Chennai': 2100, 'Kolkata': 600, 'default': 1500},
        'Rishikesh': {'Delhi': 240, 'Mumbai': 1700, 'Bangalore': 2400, 'Chennai': 2600, 'Kolkata': 1600, 'default': 1300},
        'Andaman': {'Delhi': 3000, 'Mumbai': 2500, 'Bangalore': 2300, 'Chennai': 1400, 'Kolkata': 1500, 'default': 2200},
        'Varanasi': {'Delhi': 800, 'Mumbai': 1400, 'Bangalore': 1900, 'Chennai': 1700, 'Kolkata': 700, 'default': 1100},
        'Ooty': {'Delhi': 2500, 'Mumbai': 1200, 'Bangalore': 270, 'Chennai': 560, 'Kolkata': 2200, 'default': 1300},
        'Agra': {'Delhi': 230, 'Mumbai': 1200, 'Bangalore': 1900, 'Chennai': 1800, 'Kolkata': 1300, 'default': 1000},
        'Munnar': {'Delhi': 2800, 'Mumbai': 1500, 'Bangalore': 480, 'Chennai': 590, 'Kolkata': 2600, 'default': 1500},
        'Jaisalmer': {'Delhi': 800, 'Mumbai': 900, 'Bangalore': 2000, 'Chennai': 2100, 'Kolkata': 2000, 'default': 1300},
    }

    # Cost bases
    travel_cost_per_km = {'bus': 1.0, 'train': 1.3, 'flight': 3.5, 'car': 7.0}
    hotel_cost_per_night = {'hostel': 600, 'budget': 1200, '3-star': 2800, '4-star': 5500, '5-star': 11000}
    food_cost_per_day = {'budget': 500, 'mixed': 1000, 'luxury': 2200}
    activity_cost_per_day = {'low': 400, 'moderate': 1500, 'high': 3500}
    season_multiplier = {'summer': 1.25, 'monsoon': 0.8, 'autumn': 1.05, 'winter': 1.4}

    data = []
    for _ in range(n_samples):
        source = np.random.choice(cities)
        destination = np.random.choice(destinations)
        travel_mode = np.random.choice(travel_modes)
        season = np.random.choice(seasons)
        num_days = np.random.randint(2, 15)
        hotel_type = np.random.choice(hotel_types)
        activity_level = np.random.choice(activity_levels)
        food_pref = np.random.choice(food_preferences)
        group_size = np.random.randint(1, 8)

        # Get distance
        dist_data = distance_map.get(destination, {})
        distance = dist_data.get(source, dist_data.get('default', 1000))
        distance += np.random.randint(-100, 100)  # Add noise
        distance = max(100, distance)

        # Calculate costs with noise
        mult = season_multiplier[season]
        noise = lambda: np.random.uniform(0.85, 1.15)

        travel_cost = distance * travel_cost_per_km[travel_mode] * mult * noise()
        if travel_mode == 'flight':
            travel_cost = max(2500, travel_cost) + np.random.randint(0, 1500)

        stay_cost = hotel_cost_per_night[hotel_type] * num_days * mult * noise()
        food_cost = food_cost_per_day[food_pref] * num_days * noise()
        act_cost = activity_cost_per_day[activity_level] * num_days * 0.6 * noise()

        total_cost = travel_cost + stay_cost + food_cost + act_cost
        # Group discount
        if group_size >= 4:
            total_cost *= 0.9
        per_person = total_cost / group_size

        data.append({
            'source_city': source,
            'destination_city': destination,
            'distance': round(distance),
            'travel_mode': travel_mode,
            'season': season,
            'num_days': num_days,
            'hotel_type': hotel_type,
            'activity_level': activity_level,
            'food_preference': food_pref,
            'group_size': group_size,
            'travel_cost': round(travel_cost),
            'stay_cost': round(stay_cost),
            'food_cost': round(food_cost),
            'activity_cost': round(act_cost),
            'total_cost': round(total_cost),
            'per_person_cost': round(per_person),
        })

    return pd.DataFrame(data)


# ==================== TRAIN MODEL ====================

def train_model():
    print("📊 Generating synthetic dataset...")
    df = generate_dataset(5000)

    # Save dataset
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/travel_costs.csv', index=False)
    print(f"✅ Dataset saved: {len(df)} samples")
    print(f"   Columns: {list(df.columns)}")
    print(f"\n📈 Dataset statistics:")
    print(df[['total_cost', 'travel_cost', 'stay_cost', 'food_cost', 'activity_cost']].describe().round(0))

    # Encode categorical features
    label_encoders = {}
    categorical_cols = ['source_city', 'destination_city', 'travel_mode', 'season', 'hotel_type', 'activity_level', 'food_preference']

    df_encoded = df.copy()
    for col in categorical_cols:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col])
        label_encoders[col] = le

    # Features and targets
    feature_cols = ['source_city', 'destination_city', 'distance', 'travel_mode', 'season', 'num_days', 'hotel_type', 'activity_level', 'food_preference', 'group_size']
    target_cols = ['total_cost', 'travel_cost', 'stay_cost', 'food_cost', 'activity_cost']

    X = df_encoded[feature_cols]
    y_total = df_encoded['total_cost']

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_total, test_size=0.2, random_state=42)

    print(f"\n🔧 Training RandomForest model...")
    print(f"   Train: {len(X_train)}, Test: {len(X_test)}")

    # Hyperparameter tuning
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [10, 15, 20],
        'min_samples_split': [2, 5],
    }

    rf = RandomForestRegressor(random_state=42, n_jobs=-1)
    grid_search = GridSearchCV(rf, param_grid, cv=3, scoring='r2', n_jobs=-1, verbose=0)
    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_
    print(f"   Best params: {grid_search.best_params_}")

    # Evaluate
    y_pred = best_model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"\n📊 Model Performance:")
    print(f"   MAE: ₹{mae:.0f}")
    print(f"   R² Score: {r2:.4f}")

    # Train individual models for breakdown
    breakdown_models = {}
    for target in ['travel_cost', 'stay_cost', 'food_cost', 'activity_cost']:
        y_target = df_encoded[target]
        X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(X_scaled, y_target, test_size=0.2, random_state=42)
        model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
        model.fit(X_train_t, y_train_t)
        r2_t = r2_score(y_test_t, model.predict(X_test_t))
        breakdown_models[target] = model
        print(f"   {target} R²: {r2_t:.4f}")

    # Save models
    os.makedirs('models', exist_ok=True)
    model_data = {
        'total_model': best_model,
        'breakdown_models': breakdown_models,
        'scaler': scaler,
        'label_encoders': label_encoders,
        'feature_cols': feature_cols,
        'metrics': {'mae': float(mae), 'r2': float(r2)},
    }

    joblib.dump(model_data, 'models/model.pkl')
    print(f"\n✅ Model saved to models/model.pkl")
    print(f"   File size: {os.path.getsize('models/model.pkl') / 1024:.1f} KB")

    # Save metadata
    metadata = {
        'features': feature_cols,
        'targets': target_cols,
        'categorical_features': categorical_cols,
        'label_mappings': {col: list(le.classes_) for col, le in label_encoders.items()},
        'metrics': {'mae': float(mae), 'r2': float(r2)},
        'n_samples': len(df),
        'best_params': grid_search.best_params_,
    }

    with open('models/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"   Metadata saved to models/metadata.json")
    return model_data


if __name__ == '__main__':
    train_model()
