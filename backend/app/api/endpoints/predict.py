from fastapi import APIRouter, HTTPException
from app.models.schemas import PredictRequest, PredictResponse
from app.services.model_service import predict_profile, default_values
from app.services.skill_gap_service import run_skill_gap_analysis
from app.services.goal_engine_service import generate_daily_goals_backend

router = APIRouter(tags=["Prediction"])

@router.get("/defaults")
def get_defaults():
    return default_values

@router.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        user_data = request.model_dump()
        pred_status, placement_prob, not_placed_prob = predict_profile(user_data)
        skill_analysis, top_priorities = run_skill_gap_analysis(user_data)
        goals, total_min, avail_min, adapt_mode, adapt_msg = generate_daily_goals_backend(
            user_data,
            top_priorities=top_priorities,
            recent_completion_rate=user_data.get("recent_completion_rate"),
            improved_skill=user_data.get("improved_skill"),
            improved_pct=user_data.get("improved_pct")
        )

        return {
            "placement_status": pred_status,
            "placement_probability": placement_prob,
            "not_placed_probability": not_placed_prob,
            "skill_gap_analysis": skill_analysis,
            "top_priorities": top_priorities,
            "daily_goals": goals,
            "total_goal_minutes": total_min,
            "available_study_minutes": avail_min,
            "adaptive_mode": adapt_mode,
            "adaptive_recommendation_message": adapt_msg,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
