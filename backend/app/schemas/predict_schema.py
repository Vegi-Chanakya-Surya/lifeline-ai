from pydantic import BaseModel
from typing import Optional, List

class PredictRequest(BaseModel):
    age: int
    gender: str

    height: Optional[float] = None
    weight: Optional[float] = None

    sleep: int
    exercise: int
    stress: int          # numeric scale 1–10
    smoking: bool
    alcohol: int

    medical: str         # simple string for MVP

    # OPTIONAL lifestyle info (not required)
    activity: Optional[str] = None
    diet: Optional[str] = None
