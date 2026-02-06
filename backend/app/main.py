import os
from typing import List, Optional, Dict, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import google.generativeai as genai

# -----------------------------
# FastAPI app (ONLY ONE APP)
# -----------------------------
app = FastAPI(
    title="Lifeline AI Backend",
    version="1.0.0",
)

# -----------------------------
# CORS (frontend -> backend)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Gemini Setup
# -----------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# -----------------------------
# Models
# -----------------------------
class PredictRequest(BaseModel):
    age: int = Field(..., ge=1, le=120)
    gender: str
    height: float = Field(..., gt=0)  # cm
    weight: float = Field(..., gt=0)  # kg
    sleep: int = Field(..., ge=0, le=24)
    exercise: int = Field(..., ge=0, le=300)  # minutes/day
    activity: str
    diet: str
    stress: str
    smoking: bool
    alcohol: bool
    medical: List[str] = []
    bmi: Optional[float] = None


class PredictResponse(BaseModel):
    bmi: float
    risk_score: int
    risk_level: str
    contributing_factors: List[str]
    note: str


class AnalyzeResponse(BaseModel):
    analysis: str


# -----------------------------
# Helpers
# -----------------------------
def compute_bmi(height_cm: float, weight_kg: float) -> float:
    h_m = height_cm / 100.0
    return round(weight_kg / (h_m * h_m), 1)


def simple_risk_engine(req: PredictRequest) -> Dict[str, Any]:
    """
    Simple placeholder risk logic (NOT medical advice).
    """
    bmi = req.bmi if req.bmi is not None else compute_bmi(req.height, req.weight)

    score = 0
    factors = []

    # BMI
    if bmi >= 30:
        score += 30
        factors.append("High BMI (Obesity range)")
    elif bmi >= 25:
        score += 20
        factors.append("BMI in overweight range")
    elif bmi < 18.5:
        score += 10
        factors.append("Low BMI (underweight)")

    # Sleep
    if req.sleep < 6:
        score += 10
        factors.append("Low sleep duration")
    elif req.sleep > 9:
        score += 5
        factors.append("Very high sleep duration")

    # Exercise
    if req.exercise < 20:
        score += 10
        factors.append("Low daily exercise")
    elif req.exercise >= 60:
        score -= 5
        factors.append("Good daily exercise")

    # Stress
    if req.stress.lower() == "high":
        score += 10
        factors.append("High stress")
    elif req.stress.lower() == "medium":
        score += 5
        factors.append("Medium stress")

    # Smoking / Alcohol
    if req.smoking:
        score += 15
        factors.append("Smoking")
    if req.alcohol:
        score += 8
        factors.append("Alcohol usage")

    # Medical background
    medical_lower = [m.lower() for m in req.medical]
    if any("diabetes" in m for m in medical_lower):
        score += 15
        factors.append("Existing diabetes history")
    if any("hypertension" in m or "bp" in m for m in medical_lower):
        score += 12
        factors.append("Hypertension history")
    if any("heart" in m for m in medical_lower):
        score += 15
        factors.append("Heart disease history")

    # clamp score 0..100
    score = max(0, min(100, score))

    if score >= 70:
        level = "High"
    elif score >= 40:
        level = "Medium"
    else:
        level = "Low"

    return {
        "bmi": bmi,
        "risk_score": score,
        "risk_level": level,
        "contributing_factors": factors if factors else ["No major risk flags detected"],
        "note": "This is an early prototype estimate. Not medical advice.",
    }


def build_gemini_prompt(req: PredictRequest, risk: Dict[str, Any]) -> str:
    return f"""
You are Lifeline AI, a wellness assistant. This is NOT medical advice.
Use the user's health inputs and the prototype risk score to explain risk factors and give actionable suggestions.

User Inputs:
- Age: {req.age}
- Gender: {req.gender}
- Height(cm): {req.height}
- Weight(kg): {req.weight}
- BMI: {risk["bmi"]}
- Sleep(hours): {req.sleep}
- Exercise(min/day): {req.exercise}
- Activity level: {req.activity}
- Diet quality: {req.diet}
- Stress level: {req.stress}
- Smoking: {req.smoking}
- Alcohol: {req.alcohol}
- Medical background: {req.medical}

Prototype Risk:
- Risk score: {risk["risk_score"]}/100
- Risk level: {risk["risk_level"]}
- Contributing factors: {risk["contributing_factors"]}

Return STRICT JSON with keys:
risk_summary (string),
risk_factors (array of strings),
workout_plan_summary (string),
nutrition_plan_summary (string),
daily_spark (string)

Do not include markdown. Output JSON only.
"""


# -----------------------------
# Routes
# -----------------------------
@app.get("/")
def root():
    return {"ok": True, "message": "Lifeline AI backend is running"}

@app.get("/health")
def health():
    return {"status": "UP"}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    return simple_risk_engine(req)

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: PredictRequest):
    # fallback if key missing
    if not GEMINI_API_KEY:
        return {
            "analysis": "GEMINI_API_KEY is missing. Add it to backend/.env and restart backend."
        }

    # Use same request model, compute risk first
    risk = simple_risk_engine(req)
    prompt = build_gemini_prompt(req, risk)

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)

    return {"analysis": response.text}
