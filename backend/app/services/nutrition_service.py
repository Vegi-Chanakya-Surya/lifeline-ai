import json
from core.groq_client import generate_ai_response

def build_nutrition_prompt(data):
    return f"""
You are a certified Indian nutritionist.

Generate a 7-day INDIAN diet plan using
common Indian household foods.
Avoid western dishes.

User details:
- Goal: {data.goal}
- Dietary preference: {data.diet}
- Activity level: {data.activity}
- Allergies: {data.allergies or "none"}

Return ONLY valid JSON in this format:
{{
  "plan": [
    {{
      "day": "Day 1",
      "breakfast": ["..."],
      "lunch": ["..."],
      "snacks": ["..."],
      "dinner": ["..."],
      "tip": ""
    }}
  ]
}}
"""
def generate_nutrition_plan(data):
    prompt = build_nutrition_prompt(data)

    try:
        ai_response = generate_ai_response(prompt)
        ai_response = ai_response.strip()

        if ai_response.startswith("```"):
            ai_response = ai_response.replace("```json", "").replace("```", "").strip()

        plan_json = json.loads(ai_response)

        if "plan" not in plan_json:
            raise ValueError("Invalid nutrition format")

        return plan_json

    except Exception as e:
        print("❌ NUTRITION AI ERROR:", e)

        # Safe fallback
        return {
            "plan": [
                {
                    "day": "Day 1",
                    "breakfast": ["Oats with fruits"],
                    "lunch": ["Rice, dal, vegetables"],
                    "snacks": ["Nuts or fruit"],
                    "dinner": ["Light chapati + curry"],
                    "tip": "Drink enough water."
                }
            ]
        }
