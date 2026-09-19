import joblib
import pandas as pd
import numpy as np
from ..config import MODEL_PATH, DEFAULTS_PATH, DEFAULT_FALLBACK_VALUES

class HeuristicPlacementModel:
    def __init__(self):
        self.feature_names_in_ = [
            "cgpa", "internships_count", "projects_count", "coding_skill_score",
            "aptitude_score", "communication_skill_score", "logical_reasoning_score",
            "mock_interview_score", "backlogs", "study_hours_per_day"
        ]
        self.classes_ = ["Not Placed", "Placed"]

    def predict_proba(self, df: pd.DataFrame) -> np.ndarray:
        probs = []
        for _, row in df.iterrows():
            cgpa = float(row.get("cgpa", 7.0))
            coding = float(row.get("coding_skill_score", 50))
            apt = float(row.get("aptitude_score", 50))
            comm = float(row.get("communication_skill_score", 50))
            mock = float(row.get("mock_interview_score", 50))
            projects = float(row.get("projects_count", 1))
            backlogs = float(row.get("backlogs", 0))

            score = (
                (cgpa / 10.0) * 25 +
                (coding / 100.0) * 25 +
                (apt / 100.0) * 15 +
                (comm / 100.0) * 15 +
                (mock / 100.0) * 10 +
                min(projects * 2.5, 10) -
                (backlogs * 10)
            )
            prob_placed = max(0.05, min(0.98, score / 100.0))
            probs.append([1.0 - prob_placed, prob_placed])
        return np.array(probs)

    def predict(self, df: pd.DataFrame) -> list:
        probs = self.predict_proba(df)
        return ["Placed" if p[1] >= 0.5 else "Not Placed" for p in probs]


def load_model():
    try:
        if MODEL_PATH.exists():
            return joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Warning: Loading placement model failed ({e}). Using Heuristic fallback.")
    return HeuristicPlacementModel()


def load_defaults():
    try:
        if DEFAULTS_PATH.exists():
            return joblib.load(DEFAULTS_PATH)
    except Exception as e:
        print(f"Warning: Loading defaults failed ({e}). Using fallback.")
    return DEFAULT_FALLBACK_VALUES


# Singletons
model = load_model()
default_values = load_defaults()


def predict_profile(data_dict: dict) -> tuple[str, float, float]:
    """Runs prediction inference and returns (status, placed_prob, not_placed_prob)"""
    feature_keys = [
        "cgpa", "internships_count", "projects_count", "coding_skill_score",
        "aptitude_score", "communication_skill_score", "logical_reasoning_score",
        "mock_interview_score", "backlogs", "study_hours_per_day"
    ]
    features = {k: data_dict.get(k, default_values.get(k, 0)) for k in feature_keys}
    input_df = pd.DataFrame([features])

    try:
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(input_df)[0]
            classes = list(getattr(model, "classes_", ["Not Placed", "Placed"]))
            
            if "Placed" in classes:
                placed_idx = classes.index("Placed")
                placed_prob = round(float(probs[placed_idx]) * 100, 2)
                not_placed_prob = round(100.0 - placed_prob, 2)
            else:
                placed_prob = round(float(probs[1]) * 100, 2)
                not_placed_prob = round(float(probs[0]) * 100, 2)

            status = "Placed" if placed_prob >= 50.0 else "Not Placed"
        else:
            prediction = model.predict(input_df)[0]
            status = str(prediction)
            placed_prob = 85.0 if status.lower() == "placed" else 25.0
            not_placed_prob = 100.0 - placed_prob
            
    except Exception as e:
        print(f"Inference error with primary model: {e}. Executing heuristic fallback.")
        fallback = HeuristicPlacementModel()
        probs = fallback.predict_proba(input_df)[0]
        placed_prob = round(float(probs[1]) * 100, 2)
        not_placed_prob = round(float(probs[0]) * 100, 2)
        status = "Placed" if placed_prob >= 50.0 else "Not Placed"

    return status, placed_prob, not_placed_prob
