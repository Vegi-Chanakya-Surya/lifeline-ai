from pydantic import BaseModel
from typing import Optional

class NutritionRequest(BaseModel):
    goal: str
    diet: str
    activity: str
    allergies: Optional[str] = None
