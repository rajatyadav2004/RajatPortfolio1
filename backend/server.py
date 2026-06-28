from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, httpx, asyncio, resend
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
OWNER_EMAIL = os.environ.get('OWNER_EMAIL', '')

app = FastAPI()
api_router = APIRouter(prefix="/api")


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=4000)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "Rajat Portfolio API live"}


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    obj = Contact(**payload.model_dump())
    doc = obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.contacts.insert_one(doc)

    # Fire-and-forget email notification via Resend (non-blocking on failure)
    if resend.api_key and OWNER_EMAIL:
        html = f"""
        <div style=\"font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:#030308; color:#fff; padding:32px; border-radius:16px;\">
          <div style=\"font-family: 'JetBrains Mono', monospace; font-size:11px; color:#00FFF0; letter-spacing:0.2em; margin-bottom:16px;\">// NEW TRANSMISSION · RAJAT PORTFOLIO</div>
          <h2 style=\"font-size:24px; margin:0 0 16px; color:#fff;\">{obj.name} just reached out</h2>
          <table style=\"width:100%; border-collapse:collapse; margin-bottom:20px;\">
            <tr><td style=\"padding:6px 0; color:#8a8aa8; font-size:12px; width:90px;\">From</td><td style=\"color:#fff;\">{obj.name} &lt;{obj.email}&gt;</td></tr>
            <tr><td style=\"padding:6px 0; color:#8a8aa8; font-size:12px;\">At</td><td style=\"color:#fff;\">{doc['timestamp']}</td></tr>
            <tr><td style=\"padding:6px 0; color:#8a8aa8; font-size:12px;\">ID</td><td style=\"color:#fff;\">{obj.id}</td></tr>
          </table>
          <div style=\"background:rgba(0,255,240,0.05); border-left:2px solid #00FFF0; padding:16px 20px; white-space:pre-wrap; line-height:1.6; color:#fff;\">{obj.message}</div>
          <div style=\"margin-top:24px; font-size:11px; color:#8a8aa8; font-family: monospace;\">Reply directly to <a href=\"mailto:{obj.email}\" style=\"color:#00FFF0;\">{obj.email}</a></div>
        </div>
        """
        try:
            await asyncio.to_thread(resend.Emails.send, {
                "from": f"Rajat Portfolio <{SENDER_EMAIL}>",
                "to": [OWNER_EMAIL],
                "reply_to": obj.email,
                "subject": f"New transmission from {obj.name}",
                "html": html,
            })
        except Exception as e:
            logging.warning(f"resend send failed: {e}")

    return obj


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    rows = await db.contacts.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)
    for r in rows:
        if isinstance(r.get('timestamp'), str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


@api_router.get("/github/contributions")
async def github_contributions(username: str = "rajat-cse"):
    """Fetch public contribution data via the unofficial JSON endpoint.
    Falls back to a synthetic 52-week pattern if the API is unreachable."""
    try:
        async with httpx.AsyncClient(timeout=6.0) as hc:
            r = await hc.get(f"https://github-contributions-api.jogruber.de/v4/{username}?y=last")
            if r.status_code == 200:
                data = r.json()
                return {"username": username, "total": data.get("total", {}), "contributions": data.get("contributions", [])}
    except Exception as e:
        logging.warning(f"github fetch failed: {e}")
    # synthetic fallback — 365 days
    import random
    random.seed(42)
    days = []
    for i in range(365):
        days.append({"date": f"day-{i}", "count": random.choice([0, 0, 0, 1, 2, 3, 5, 8, 12])})
    return {"username": username, "total": {"lastYear": sum(d['count'] for d in days)}, "contributions": days, "synthetic": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
