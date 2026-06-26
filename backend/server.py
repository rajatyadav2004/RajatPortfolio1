from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
