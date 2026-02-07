from fastapi import APIRouter
from schemas.nutrition import NutritionRequest
from services.nutrition_service import generate_nutrition_plan

router = APIRouter(prefix="/nutrition", tags=["Nutrition"])

@router.post("/generate")
def generate_nutrition(request: NutritionRequest):
    return generate_nutrition_plan(request)
