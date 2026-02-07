import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

print("KEY PRESENT:", bool(os.getenv("GEMINI_API_KEY")))

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="Say 'Gemini is working' in one sentence."
)

print("RESPONSE:")
print(response.text)
