from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL_NAME = os.getenv("MODEL_NAME", "llama-3.1-8b-instant")

def generate_ai_response(prompt: str):
    print("🧠 MODEL USED:", MODEL_NAME)
    print("🔑 KEY LOADED:", os.getenv("GROQ_API_KEY")[:6])

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": "You are a certified fitness coach. Respond only in valid JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.6,
        max_tokens=700
    )

    return response.choices[0].message.content.strip()
