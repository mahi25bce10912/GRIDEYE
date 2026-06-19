from math import radians, sin, cos, sqrt, atan2
import os
import pickle
import math
import numpy as np
import pandas as pd
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS explicitly to accept traffic from React Vite frontend
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

# Global In-Memory Store for Live Map Incidents
active_incidents = [
    {
        "id": 1,
        "corridor": "Outer Ring Road",
        "event_type": "Accident",
        "event_cause": "Vehicle Breakdown",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "radius": 2.5,
        "timestamp": "2026-06-17T20:00:00"
    }
]

MODEL_PATH = "catboost_traffic_model.pkl"
model_bundle = None

# Attempt to load model bundle safely
if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, "rb") as f:
            model_bundle = pickle.load(f)
        print(f"Successfully loaded CatBoost model bundle v{model_bundle.get('version', 'unknown')}")
    except Exception as e:
        print(f"Error loading model bundle: {str(e)}. Fallback routing rules activated.")
else:
    print(f"Warning: {MODEL_PATH} not found. Operating on deterministic fallback pipeline.")


# Deterministic fallback logic to mimic model logic if pickle file is not present
def mathematical_fallback_prediction(engineered_df):
    row = engineered_df.iloc[0]
    
    # Extract structural factors
    is_peak = int(row.get("is_peak_hour", 0))
    is_closure = int(row.get("road_closure", 0))
    dist_log = float(row.get("distance_km_log", 0.0))
    
    # Weight scoring variables matching training importance ratios
    score = 30.0  # Baseline load
    
    # Peak Hours component
    if is_peak == 1:
        score += 20.0
        
    # Road Closure component
    if is_closure == 1:
        score += 25.0
        
    # Distance scaling contribution
    score += min(dist_log * 8, 15.0)
    
    # Event cause modifier adjustments
    cause = str(row.get("event_cause", "Unknown")).lower()
    if any(k in cause for k in ["accident", "crash", "flooding", "waterlogging"]):
        score += 15.0
    elif "breakdown" in cause:
        score += 8.0
        
    # Final clamping bounds
    final_score = int(min(max(score, 0), 100))
    return final_score


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing payload data"}), 400

        # 1. Extract & Strict Cast Categorical Fields to String (Crucial for CatBoost)
        corridor = str(data.get("corridor", "Unknown"))
        event_cause = str(data.get("event_cause", "Unknown"))
        event_type = str(data.get("event_type", "Unknown"))
        zone = str(data.get("zone", "Unknown"))
        priority = str(data.get("priority", "Medium"))
        
        try:
            latitude = float(data.get("latitude", 12.9716))
            longitude = float(data.get("longitude", 77.5946))
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid Latitude/Longitude numeric values"}), 400
            
        raw_closure = data.get("road_closure", 0)
        # Normalize road closure to strict numeric binary 0/1 matching pipeline
        if str(raw_closure).strip().lower() in ["yes", "true", "1"]:
            road_closure = 1
        else:
            road_closure = 0

        # 2. Process Time Parameters safely
        datetime_str = data.get("datetime")
        if datetime_str:
            try:
                dt = datetime.fromisoformat(str(datetime_str).replace("Z", ""))
            except ValueError:
                dt = datetime.now()
        else:
            dt = datetime.now()

        hour = dt.hour
        day_of_week = dt.weekday()
        month = dt.month

        # Match exact custom peak hour constraints specified in training notebook logic
        is_peak_hour = 1 if ((8 <= hour <= 11) or (17 <= hour <= 21)) else 0

        # Features for distance modeling & log smoothing
        distance_km = float(data.get("distance_km", 2.5))
        distance_km_log = float(np.log1p(distance_km))

        # Expected duration mapping extraction directly from pipeline rules
        if model_bundle and "historical_duration_map" in model_bundle:
            expected_duration = model_bundle["historical_duration_map"].get(
                event_type, model_bundle["overall_median_duration"]
            )
        else:
            expected_duration = 55.0 if event_type.lower() == "accident" else 35.0

        # 3. Construct payload DataFrame structured EXACTLY in the training feature order
        feature_dict = {
            "event_type": [event_type],
            "event_cause": [event_cause],
            "latitude": [latitude],
            "longitude": [longitude],
            "distance_km_log": [distance_km_log],
            "road_closure": [road_closure],
            "corridor": [corridor],
            "zone": [zone],
            "hour": [hour],
            "day_of_week": [day_of_week],
            "month": [month],
            "is_peak_hour": [is_peak_hour],
            "expected_duration": [expected_duration]
        }
        
        input_df = pd.DataFrame(feature_dict)

        # Force continuous object enforcement to string types for CatBoost native categories
        for col in ["event_type", "event_cause", "corridor", "zone"]:
            input_df[col] = input_df[col].astype(str)

        # 4. Run Prediction Inference Execution Block
        if model_bundle is not None:
            model = model_bundle["model"]
            pred_class = model.predict(input_df)[0]
            probabilities = model.predict_proba(input_df)[0]
            
            confidence = float(max(probabilities) * 100)
            priority_weight = 1.0 if int(pred_class) == 1 else 0.3
            duration_weight = min(expected_duration / 120.0, 1.0)
            distance_weight = min(distance_km / 10.0, 1.0)

            # Re-generate decision pipeline score formula
            calculated_score = (
                (priority_weight * 35) +
                ((confidence / 100.0) * 25) +
                (duration_weight * 20) +
                (road_closure * 10) +
                (distance_weight * 10)
            )
            congestion_score = int(min(max(calculated_score, 0), 100))
        else:
            # Fallback mathematical logic if model pickle is missing
            congestion_score = mathematical_fallback_prediction(input_df)

        # 5. Dynamic Smart Resource Formulas & Probability mapping
        priority_multipliers = {'Low': 0.7, 'Medium': 1.0, 'High': 1.4, 'Critical': 1.9}
        pm = priority_multipliers.get(priority, 1.0)

        # Calculate live resources
        expected_delay_output = int(congestion_score * 0.4 + (expected_duration * 0.2))
        road_closure_probability = min(int(congestion_score * 0.8 * pm), 100)
        calculated_radius = round((distance_km * 0.4) + (congestion_score / 50.0), 2)
        
        # 🚨 Dynamic Resource Allocation formulas
        required_officers = int(0 + congestion_score * 0.2)
        required_barricades = max(2, int(congestion_score / 8))
        
        if road_closure_probability > 55 or road_closure == 1:
            should_close_road = "YES"
        else:
            should_close_road = "NO"
            
        expected_duration_hours = round((expected_delay_output / 20) * 1.1, 1)
        affected_vehicles = int(congestion_score * 18 + (is_peak_hour * 850))

        # 6. Determine semantic metadata matching the threshold tiers
        if congestion_score >= 80:
            impact_level = "Very High Impact"
            risk_tier = "Critical"
            ai_recs = ["Implement mandatory outer perimeter diversions.", "Deploy immediate physical traffic response squads."]
        elif congestion_score >= 60:
            impact_level = "Heavy"
            risk_tier = "High"
            ai_recs = ["Recommend alternative corridor path routing to approaching vehicles.", "Manually override signal times on adjacent junctions."]
        elif congestion_score >= 40:
            impact_level = "Medium"
            risk_tier = "Medium"
            ai_recs = ["Monitor queue propagation via local live camera feeds.", "Dispatch secondary towing units if blockage lingers."]
        else:
            impact_level = "Low"
            risk_tier = "Low"
            ai_recs = ["Normal queue clearing pattern expected.", "No major dynamic intervention required."]

        # Generate full 24-hour array simulating traffic spikes centered around the input hour for frontend charts
        timeline_chart_data = []
        for h in range(24):
            base = 15 + 40 * math.exp(-((h - 9) ** 2) / 8) + 45 * math.exp(-((h - 18) ** 2) / 8)
            event_spike = (congestion_score * 0.6) * math.exp(-((h - hour) ** 2) / 3)
            timeline_chart_data.append({
                "time": f"{h:02d}:00",
                "normal_flow": int(base),
                "predicted_flow": int(min(base + event_spike, 100))
            })

        # 7. Complete Payload Payload Delivery Package mapped directly to UI nodes
        return jsonify({
            "status": "success",
            "congestion_score": congestion_score,
            "impact_level": impact_level,
            "risk_level": risk_tier,
            "expected_delay_output": expected_delay_output,
            "affected_area": corridor,
            "traffic_increase": f"{int(congestion_score * 0.85)}%",
            "affected_vehicles": affected_vehicles,
            "ai_recommendations": ai_recs,
            "timeline_chart_data": timeline_chart_data,
            "predictions": {
                "expected_delay_output": expected_delay_output,
                "road_closure_probability": f"{road_closure_probability}%",
                "should_close_road": should_close_road,
                "affected_radius_km": calculated_radius,
                "police_officers_required": int(required_officers),
                "barricades_required": int(required_barricades),
                "expected_duration_hours": expected_duration_hours
            }
        }), 200

    except Exception as e:
        return jsonify({"error": f"Internal pipeline exception: {str(e)}"}), 500


@app.route("/api/events", methods=["GET", "POST"])
def manage_events():
    if request.method == "POST":
        data = request.get_json() or {}
        new_id = len(active_incidents) + 1
        new_incident = {
            "id": new_id,
            "corridor": str(data.get("corridor", "Unknown Link")),
            "event_type": str(data.get("event_type", "Incident")),
            "event_cause": str(data.get("event_cause", "Unspecified")),
            "latitude": float(data.get("latitude", 12.9716)),
            "longitude": float(data.get("longitude", 77.5946)),
            "radius": float(data.get("radius", 1.5)),
            "timestamp": datetime.now().isoformat()
        }
        active_incidents.append(new_incident)
        return jsonify({"status": "Success", "incident": new_incident}), 201
        
    return jsonify({"active_incidents": active_incidents}), 200


# Fallback Route Error Handling Structures
@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad Request parameters", "details": str(error)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource route endpoint not found"}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal Engine Processing Error", "details": str(error)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
