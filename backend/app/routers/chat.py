from fastapi import APIRouter
from schemas.chat import ChatRequest
from services.chat_service import chat_with_user_context

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("")
def chat(req: ChatRequest):
    return chat_with_user_context(req.user_id, req.message)

