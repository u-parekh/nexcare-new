from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request, Query
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import io
import asyncio
import logging
import resend
import httpx
import smtplib
from email.message import EmailMessage
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

resend.api_key = os.environ.get("RESEND_API_KEY", "re_4nRqd42c_JXK6KPijrVSUzGbLzoQryD7t")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
NOTIFICATION_EMAIL = os.environ.get("NOTIFICATION_EMAIL", "umangparekh99@gmail.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "NexCare@2026")

# SMTP / Mailtrap fallback (dev): configure these in backend/.env to enable
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587")) if os.environ.get("SMTP_PORT") else 587
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
SMTP_FROM = os.environ.get("SMTP_FROM", SENDER_EMAIL)

# Friendly detection for Mailtrap (developer convenience)
if SMTP_HOST:
    try:
        host_l = SMTP_HOST.lower()
        if "mailtrap" in host_l or host_l.endswith("mailtrap.io"):
            masked_user = (SMTP_USER[:3] + "***") if SMTP_USER else "(not provided)"
            logger.info("Mailtrap SMTP configured (dev): messages will appear in Mailtrap. SMTP user=%s", masked_user)
            logger.info("Open https://mailtrap.io to view caught messages for this account.")
        else:
            logger.info("SMTP configured: host=%s port=%s (from=%s)", SMTP_HOST, SMTP_PORT, SMTP_FROM)
    except Exception:
        logger.debug("SMTP host detection failed; continuing without Mailtrap hints.")

app = FastAPI(title="NEXCARE API")
#--api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


# ---------- Models ----------
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default="", max_length=40)
    
    service: Optional[str] = Field(default="", max_length=80)
    message: str = Field(..., min_length=3, max_length=4000)


class Contact(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"


class AdminLogin(BaseModel):
    password: str


class QuizSubmit(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=4, max_length=40)
    answers: List[int]
    score: int
    total: int
    recommended: List[str] = []


class VisitTrack(BaseModel):
    visitor_id: str
    path: str
    referrer: Optional[str] = ""
    user_agent: Optional[str] = ""


class HeartbeatPing(BaseModel):
    visitor_id: str
    path: str
    seconds: int


# ---------- Helpers ----------
def parse_device(ua: str) -> str:
    ua = (ua or "").lower()
    if "mobile" in ua or "iphone" in ua or "android" in ua: return "mobile"
    if "ipad" in ua or "tablet" in ua: return "tablet"
    return "desktop"


def parse_browser(ua: str) -> str:
    ua = (ua or "").lower()
    if "edg/" in ua: return "Edge"
    if "chrome/" in ua and "safari/" in ua: return "Chrome"
    if "firefox/" in ua: return "Firefox"
    if "safari/" in ua: return "Safari"
    return "Other"


async def lookup_geo(ip: str) -> Dict[str, Any]:
    if not ip or ip.startswith("127.") or ip.startswith("10.") or ip.startswith("192.168."):
        return {"city": "Local", "country": "—", "region": "—"}
    try:
        async with httpx.AsyncClient(timeout=4.0) as c:
            r = await c.get(f"https://ipapi.co/{ip}/json/")
            if r.status_code == 200:
                d = r.json()
                return {"city": d.get("city") or "—", "country": d.get("country_name") or "—", "region": d.get("region") or "—"}
    except Exception as e:
        logger.debug(f"geo lookup failed: {e}")
    return {"city": "—", "country": "—", "region": "—"}


def get_client_ip(req: Request) -> str:
    fwd = req.headers.get("x-forwarded-for")
    if fwd: return fwd.split(",")[0].strip()
    return req.client.host if req.client else "0.0.0.0"


def build_email_html(c: Contact) -> str:
    return f"""<table style="font-family:Arial;max-width:640px;margin:0 auto;border:1px solid #e2e8f0;">
<tr><td style="background:#0E4A8A;color:#fff;padding:20px 24px;font-size:18px;font-weight:700;">NEXCARE • New Contact Form Submission</td></tr>
<tr><td style="padding:24px;color:#0A0F14;"><table style="width:100%;font-size:14px;">
<tr><td style="padding:6px 0;width:120px;color:#4A5568;">Name</td><td style="font-weight:600;">{c.name}</td></tr>
<tr><td style="padding:6px 0;color:#4A5568;">Email</td><td><a href="mailto:{c.email}" style="color:#0E4A8A;">{c.email}</a></td></tr>
<tr><td style="padding:6px 0;color:#4A5568;">Phone</td><td>{c.phone or '—'}</td></tr>
<tr><td style="padding:6px 0;color:#4A5568;">Service</td><td>{c.service or '—'}</td></tr>

</table>
<div style="margin-top:16px;padding:16px;background:#F0F5F1;border-left:3px solid #3FB549;font-size:14px;line-height:1.6;">{c.message}</div>
<p style="margin-top:24px;font-size:12px;color:#A0AEC0;">Submitted {c.created_at}</p></td></tr></table>"""


async def _send_via_smtp(c: Contact) -> Optional[str]:
    if not SMTP_HOST or not NOTIFICATION_EMAIL:
        return None
    msg = EmailMessage()
    msg["Subject"] = f"NEXCARE • New enquiry from {c.name}"
    msg["From"] = SMTP_FROM
    msg["To"] = NOTIFICATION_EMAIL
    if c.email:
        msg["Reply-To"] = c.email
    # Plain text fallback and HTML alternative
    plain = f"New contact from {c.name} <{c.email}>\n\nMessage:\n{c.message}"
    msg.set_content(plain)
    msg.add_alternative(build_email_html(c), subtype="html")

    def _send():
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as s:
            s.ehlo()
            # start TLS for common SMTP ports
            try:
                if SMTP_PORT in (587, 25):
                    s.starttls()
                    s.ehlo()
            except Exception:
                pass
            if SMTP_USER:
                s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)

    try:
        await asyncio.to_thread(_send)
        return "smtp"
    except Exception as e:
        logger.error(f"SMTP send failed: {e}")
        return None


async def send_notification(c: Contact) -> Optional[str]:
    if not NOTIFICATION_EMAIL:
        return None

    # Prefer Resend if a non-default API key is configured
    default_test_key = "re_4nRqd42c_JXK6KPijrVSUzGbLzoQryD7t"
    if resend.api_key and resend.api_key != default_test_key:
        try:
            result = await asyncio.to_thread(resend.Emails.send, {
                "from": SENDER_EMAIL, "to": [NOTIFICATION_EMAIL],
                "subject": f"NEXCARE • New enquiry from {c.name}",
                "html": build_email_html(c), "reply_to": c.email,
            })
            return result.get("id") if isinstance(result, dict) else None
        except Exception as e:
            logger.error(f"Resend send failed: {e}")

    # Fallback to SMTP/Mailtrap if configured
    if SMTP_HOST:
        return await _send_via_smtp(c)

    logger.warning("No email provider configured (Resend not set or failed, SMTP not configured). Skipping notification.")
    return None


def require_admin(x_admin_token: Optional[str] = Header(default=None)):
    if not x_admin_token or x_admin_token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# ---------- Public Routes ----------
@app.get("/")
async def root():
    return {"message": "NEXCARE API", "status": "ok"}


@app.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    await db.contacts.insert_one(contact.model_dump())
    await send_notification(contact)
    return contact


@app.post("/quiz")
async def submit_quiz(payload: QuizSubmit, request: Request):
    ip = get_client_ip(request)
    ua = request.headers.get("user-agent", "")
    geo = await lookup_geo(ip)
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name, "email": payload.email, "phone": payload.phone,
        "answers": payload.answers, "score": payload.score, "total": payload.total,
        "recommended": payload.recommended,
        "ip": ip, "device": parse_device(ua), "browser": parse_browser(ua),
        "city": geo["city"], "country": geo["country"], "region": geo["region"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.quiz_submissions.insert_one(doc)
    return {"saved": True, "id": doc["id"]}


@app.post("/track/visit")
async def track_visit(payload: VisitTrack, request: Request):
    ip = get_client_ip(request)
    ua = payload.user_agent or request.headers.get("user-agent", "")
    geo = await lookup_geo(ip)
    doc = {
        "id": str(uuid.uuid4()),
        "visitor_id": payload.visitor_id, "path": payload.path,
        "referrer": payload.referrer, "ip": ip,
        "device": parse_device(ua), "browser": parse_browser(ua),
        "city": geo["city"], "country": geo["country"], "region": geo["region"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.visits.insert_one(doc)
    return {"tracked": True}


@app.post("/track/heartbeat")
async def track_heartbeat(payload: HeartbeatPing):
    await db.heartbeats.update_one(
        {"visitor_id": payload.visitor_id, "path": payload.path},
        {"$inc": {"seconds": payload.seconds}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"ok": True}


@app.post("/track/brochure")
async def track_brochure(request: Request):
    ip = get_client_ip(request)
    ua = request.headers.get("user-agent", "")
    geo = await lookup_geo(ip)
    await db.brochure_downloads.insert_one({
        "id": str(uuid.uuid4()), "ip": ip,
        "device": parse_device(ua), "browser": parse_browser(ua),
        "city": geo["city"], "country": geo["country"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


# ---------- Admin Routes ----------
@app.post("/admin/login")
async def admin_login(payload: AdminLogin):
    if payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": ADMIN_PASSWORD, "expires_in": 86400}


@app.get("/admin/contacts")
async def list_contacts(
    page: int = Query(1, ge=1), per_page: int = Query(10, ge=1, le=100),
    sort: str = Query("latest"), search: str = Query(""),
    _: bool = Depends(require_admin),
):
    q: Dict[str, Any] = {}
    if search:
        rx = {"$regex": search, "$options": "i"}
        q["$or"] = [{"name": rx}, {"email": rx}, {"subject": rx}, {"message": rx}, {"service": rx}]
    direction = -1 if sort == "latest" else 1
    total = await db.contacts.count_documents(q)
    cur = db.contacts.find(q, {"_id": 0}).sort("created_at", direction).skip((page - 1) * per_page).limit(per_page)
    items = await cur.to_list(per_page)
    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": max(1, (total + per_page - 1) // per_page)}


@app.delete("/admin/contacts/{contact_id}")
async def delete_contact(contact_id: str, _: bool = Depends(require_admin)):
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": True}


@app.patch("/admin/contacts/{contact_id}/status")
async def update_status(contact_id: str, status: str, _: bool = Depends(require_admin)):
    if status not in {"new", "read", "replied", "archived"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.contacts.update_one({"id": contact_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"updated": True, "status": status}


@app.get("/admin/analytics")
async def analytics(_: bool = Depends(require_admin)):
    now = datetime.now(timezone.utc)
    since_24h = (now - timedelta(hours=24)).isoformat()
    since_7d = (now - timedelta(days=7)).isoformat()

    total_visits = await db.visits.count_documents({})
    visits_24h = await db.visits.count_documents({"created_at": {"$gte": since_24h}})
    unique_visitors = len(await db.visits.distinct("visitor_id"))

    # avg time spent
    pipeline_time = [{"$group": {"_id": "$visitor_id", "total": {"$sum": "$seconds"}}}, {"$group": {"_id": None, "avg": {"$avg": "$total"}}}]
    t = await db.heartbeats.aggregate(pipeline_time).to_list(1)
    avg_seconds = int(t[0]["avg"]) if t else 0

    # top pages
    pages = await db.visits.aggregate([
        {"$group": {"_id": "$path", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}, {"$limit": 10},
    ]).to_list(10)

    # devices
    devices = await db.visits.aggregate([
        {"$group": {"_id": "$device", "count": {"$sum": 1}}}, {"$sort": {"count": -1}},
    ]).to_list(10)

    # countries
    countries = await db.visits.aggregate([
        {"$group": {"_id": "$country", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}, {"$limit": 8},
    ]).to_list(8)

    # 7-day timeseries
    series = await db.visits.aggregate([
        {"$match": {"created_at": {"$gte": since_7d}}},
        {"$group": {"_id": {"$substr": ["$created_at", 0, 10]}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]).to_list(7)

    brochures = await db.brochure_downloads.count_documents({})
    brochures_24h = await db.brochure_downloads.count_documents({"created_at": {"$gte": since_24h}})
    contacts_total = await db.contacts.count_documents({})
    contacts_new = await db.contacts.count_documents({"status": "new"})
    quiz_total = await db.quiz_submissions.count_documents({})

    return {
        "totals": {
            "visits": total_visits, "visits_24h": visits_24h,
            "unique_visitors": unique_visitors, "avg_seconds": avg_seconds,
            "brochures": brochures, "brochures_24h": brochures_24h,
            "contacts": contacts_total, "contacts_new": contacts_new,
            "quizzes": quiz_total,
        },
        "top_pages": [{"path": p["_id"], "count": p["count"]} for p in pages if p["_id"]],
        "devices": [{"name": d["_id"] or "unknown", "count": d["count"]} for d in devices],
        "countries": [{"name": c["_id"] or "—", "count": c["count"]} for c in countries],
        "series": [{"date": s["_id"], "count": s["count"]} for s in series],
    }


@app.get("/admin/visitors")
async def list_visitors(page: int = Query(1, ge=1), per_page: int = Query(10, ge=1, le=100), _: bool = Depends(require_admin)):
    total = await db.quiz_submissions.count_documents({})
    cur = db.quiz_submissions.find({}, {"_id": 0, "answers": 0}).sort("created_at", -1).skip((page - 1) * per_page).limit(per_page)
    items = await cur.to_list(per_page)
    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": max(1, (total + per_page - 1) // per_page)}


@app.get("/admin/brochures")
async def list_brochures(page: int = Query(1, ge=1), per_page: int = Query(10, ge=1, le=100), _: bool = Depends(require_admin)):
    total = await db.brochure_downloads.count_documents({})
    cur = db.brochure_downloads.find({}, {"_id": 0}).sort("created_at", -1).skip((page - 1) * per_page).limit(per_page)
    items = await cur.to_list(per_page)
    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": max(1, (total + per_page - 1) // per_page)}


# ---------- Brochure ----------
@app.get("/brochure")
async def download_brochure():
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=2 * cm, rightMargin=2 * cm, topMargin=2 * cm, bottomMargin=2 * cm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("title", parent=styles["Heading1"], fontSize=28, textColor=colors.HexColor("#0E4A8A"), spaceAfter=8)
    sub_style = ParagraphStyle("sub", parent=styles["Heading2"], fontSize=14, textColor=colors.HexColor("#3FB549"), spaceAfter=18)
    h2 = ParagraphStyle("h2", parent=styles["Heading2"], fontSize=16, textColor=colors.HexColor("#0E4A8A"), spaceBefore=14, spaceAfter=8)
    body = ParagraphStyle("body", parent=styles["BodyText"], fontSize=11, leading=16)

    flow = [
        Paragraph("NEXCARE", title_style),
        Paragraph("Healthcare Consulting & Hospital Planning Solutions", sub_style),
        Paragraph("NEXCARE delivers end-to-end consulting for modern healthcare facilities — from feasibility and master-planning, through architectural design, to commissioning and operations.", body),
        Spacer(1, 12),
        Paragraph("Our Services", h2),
    ]
    services = [
        ["Healthcare Consulting", "Clinical strategy, NABH/JCI readiness, operations"],
        ["Hospital Planning & Design", "Master-planning, architecture, MEP, interiors"],
        ["Server & Data Planning", "Infrastructure design, secure data residency"],
        ["Maintenance & IT", "Lifecycle support, biomedical and IT helpdesk"],
        ["Software & HMS Guidance", "EMR/HIS evaluation, integration roadmap"],
        ["Feasibility & Business Analytics", "DPRs, financial modelling, ROI analysis"],
        ["Quality Assurance", "Accreditation, audits and continuous QI"],
    ]
    t = Table(services, colWidths=[5 * cm, 11 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F0F5F1")),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#0E4A8A")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, colors.HexColor("#E2E8F0")),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    flow.append(t)
    flow.append(PageBreak())
    flow.append(Paragraph("Contact", h2))
    flow.append(Paragraph("Email: hello@nexcare.health", body))
    flow.append(Paragraph("Phone: +91 98765 43210", body))
    doc.build(flow)
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/pdf",
                             headers={"Content-Disposition": "attachment; filename=NEXCARE-Brochure.pdf"})


#app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True,
                   allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
                   allow_methods=["*"], allow_headers=["*"])


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
