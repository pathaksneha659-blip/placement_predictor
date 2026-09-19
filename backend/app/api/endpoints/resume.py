from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.resume_schemas import ResumeAnalysisResponse
from app.services.resume_service import extract_text_from_pdf, analyze_resume_text

router = APIRouter(tags=["Resume"])

@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resume files (.pdf) are supported.")

    try:
        content_bytes = await file.read()
        if len(content_bytes) == 0:
            raise HTTPException(status_code=400, detail="The uploaded PDF file is empty.")

        extracted_text = extract_text_from_pdf(content_bytes)
        if not extracted_text:
            raise HTTPException(
                status_code=400,
                detail="Unable to extract text from PDF. Ensure the file contains selectable text rather than scanned images."
            )

        analysis = analyze_resume_text(extracted_text)
        return analysis

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")
