import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from pathlib import Path

np.random.seed(42)
n_samples = 1500

cgpa = np.random.uniform(5.0, 10.0, n_samples)
internships = np.random.choice([0, 1, 2, 3, 4], size=n_samples, p=[0.35, 0.35, 0.20, 0.08, 0.02])
projects = np.random.choice(range(0, 10), size=n_samples)
coding = np.random.uniform(30.0, 100.0, n_samples)
aptitude = np.random.uniform(30.0, 100.0, n_samples)
comm = np.random.uniform(30.0, 100.0, n_samples)
logical = np.random.uniform(30.0, 100.0, n_samples)
mock = np.random.uniform(30.0, 100.0, n_samples)
backlogs = np.random.choice([0, 1, 2, 3, 4], size=n_samples, p=[0.70, 0.15, 0.08, 0.05, 0.02])
study_hours = np.random.uniform(0.5, 8.0, n_samples)

# Formula for placement probability ground truth
score = (
    (cgpa - 5.0) / 5.0 * 25.0 +
    (coding / 100.0) * 28.0 +
    (aptitude / 100.0) * 16.0 +
    (comm / 100.0) * 14.0 +
    (mock / 100.0) * 12.0 +
    (logical / 100.0) * 10.0 +
    np.minimum(internships * 5.0, 12.0) +
    np.minimum(projects * 2.0, 8.0) -
    (backlogs * 12.0) +
    np.random.normal(0, 5, n_samples)
)

y = (score >= 60.0).astype(int)
y_labels = np.array(["Not Placed", "Placed"])[y]

df = pd.DataFrame({
    "cgpa": cgpa,
    "internships_count": internships,
    "projects_count": projects,
    "coding_skill_score": coding,
    "aptitude_score": aptitude,
    "communication_skill_score": comm,
    "logical_reasoning_score": logical,
    "mock_interview_score": mock,
    "backlogs": backlogs,
    "study_hours_per_day": study_hours,
})

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression(C=1.0, max_iter=1000, random_state=42))
])

pipeline.fit(df, y_labels)

backend_dir = Path(__file__).resolve().parent
joblib.dump(pipeline, backend_dir / "placement_model.pkl")

default_values = {
    "cgpa": 7.5,
    "internships_count": 1,
    "projects_count": 3,
    "coding_skill_score": 70.0,
    "aptitude_score": 65.0,
    "communication_skill_score": 68.0,
    "logical_reasoning_score": 66.0,
    "mock_interview_score": 70.0,
    "backlogs": 0,
    "study_hours_per_day": 3.5
}
joblib.dump(default_values, backend_dir / "default_values.pkl")
print("Model and default values generated successfully with current scikit-learn!")
