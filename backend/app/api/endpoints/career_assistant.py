from fastapi import APIRouter, HTTPException
from app.models.career_schemas import CareerChatRequest, CareerChatResponse
from app.services.career_service import process_career_chat

router = APIRouter(tags=["Career Assistant"])

@router.post("/career-chat", response_model=CareerChatResponse)
def career_chat(request: CareerChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")
    try:
        res = process_career_chat(request.message, request.student_context)
        return CareerChatResponse(
            reply=res.get("reply", ""),
            is_llm_generated=res.get("is_llm_generated", False)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Career chat processing failed: {str(e)}")
