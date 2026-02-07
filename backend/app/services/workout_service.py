import json
from core.groq_client import generate_ai_response
from services.risk_engine import simple_risk_engine  # adjust import if needed

def analyze_user(req):
    risk = simple_risk_engine(req)

    prompt = f"""
You are Lifeline AI, a wellness assistant.
This is NOT medical advice.

User data:
Age: {req.age}
Gender: {req.gender}
BMI: {risk['bmi']}
Sleep: {req.sleep}
Exercise: {req.exercise}
Stress: {req.stress}
Smoking: {req.smoking}
Alcohol: {req.alcohol}
Medical history: {req.medical}

Risk score: {risk['risk_score']} / 100
Risk level: {risk['risk_level']}
Contributing factors: {risk['contributing_factors']}

Return STRICT JSON only with keys:
risk_summary (string)
risk_factors (array of strings)
workout_plan_summary (string)
nutrition_plan_summary (string)
daily_spark (string)
"""

    try:
        ai_response = generate_ai_response(prompt)
        return json.loads(ai_response)

    except Exception:
        # Safe fallback
        return {
            "risk_summary": f"Your health risk level is {risk['risk_level']}.",
            "risk_factors": risk["contributing_factors"],
            "workout_plan_summary": "Start with 30 minutes of walking daily.",
            "nutrition_plan_summary": "Eat balanced meals with fruits and vegetables.",
            "daily_spark": "Small consistent steps lead to lasting health.",
        }

def build_workout_prompt(data):
    return f"""
Generate a 7-day workout plan in STRICT JSON format.

User details:
- Goal: {data.goal}
- Location: {data.location}
- Time per day: {data.time_per_day} minutes
- Fitness level: {data.fitness_level}
- Equipment: {data.equipment or "none"}

Return ONLY valid JSON in this format:
{{
  "plan": [
    {{
      "day": "Day 1",
      "warmup": ["..."],
      "exercises": [
        {{
          "name": "",
          "sets": 0,
          "reps": 0,
          "rest": ""
        }}
      ],
      "cooldown": ["..."],
      "tip": ""
    }}
  ]
}}
"""

def generate_workout_plan(data):
    print("🔥 NEW WORKOUT SERVICE RUNNING 🔥")

    prompt = build_workout_prompt(data)

    try:
        ai_response = generate_ai_response(prompt)
        ai_response = ai_response.strip()

        # Remove markdown if present
        if ai_response.startswith("```"):
            ai_response = ai_response.replace("```json", "").replace("```", "").strip()

        plan_json = json.loads(ai_response)

        if not isinstance(plan_json, dict) or "plan" not in plan_json:
            raise ValueError("Invalid JSON structure")

        return plan_json

    except Exception as e:
        print("❌ WORKOUT AI ERROR:", e)

        # ✅ ALWAYS RETURN A VALID PLAN
        return {
            "plan": [
                {
                    "day": "Day 1",
                    "warmup": ["5 min walking", "Arm swings"],
                    "exercises": [
                        {
                            "name": "Bodyweight Squats",
                            "sets": 3,
                            "reps": "12-15",
                            "rest": "60 sec"
                        },
                        {
                            "name": "Wall Push-ups",
                            "sets": 3,
                            "reps": "10-12",
                            "rest": "60 sec"
                        }
                    ],
                    "cooldown": ["Light stretching"],
                    "tip": "Consistency matters more than intensity."
                }
            ]
        }
