from fastapi import APIRouter
from schemas.workout_schema import WorkoutRequest
def generate_workout_plan(data):
    print("🔥 NEW WORKOUT SERVICE RUNNING 🔥")

from services.workout_service import generate_workout_plan

router = APIRouter(
    prefix="/workouts",
    tags=["Workouts"]
)

@router.post("/generate")
def generate_workout(request: WorkoutRequest):
    return generate_workout_plan(request)
