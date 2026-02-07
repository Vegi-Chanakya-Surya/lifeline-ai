import firebase_admin
from firebase_admin import credentials, firestore
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")

if not os.path.exists(SERVICE_ACCOUNT_PATH):
    raise RuntimeError("❌ Firebase serviceAccountKey.json not found")

cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()
