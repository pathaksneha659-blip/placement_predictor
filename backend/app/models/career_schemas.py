from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class CareerChatRequest(BaseModel):
    message: str = Field(..., description="User message or query")
    student_context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Student profile and prediction context")

class CareerChatResponse(BaseModel):
    reply: str
    is_llm_generated: bool = False
    disclaimer: str = "AI-generated career advice provided for guidance. Placement probability is computed separately by the trained machine learning model."
