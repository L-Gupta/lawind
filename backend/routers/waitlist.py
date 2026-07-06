from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from config.settings import settings
from core.database import get_db
from core.email import send_email
from core.security import new_id
from models.waitlist import WaitlistEntry
from schemas.waitlist import WaitlistRequest, WaitlistResponse

router = APIRouter(prefix="/waitlist", tags=["waitlist"])


def _visitor_email_html(full_name: str) -> str:
    first_name = full_name.split(" ")[0] if full_name else "there"
    return f"""
    <p>Hi {first_name},</p>
    <p>Thanks for your interest in LawInd. We're onboarding law firms and in-house
    teams across India, and we've added you to the waitlist.</p>
    <p>We'll be in touch as soon as a spot opens up.</p>
    <p>&mdash; The LawInd team</p>
    """


def _founder_email_html(body: WaitlistRequest) -> str:
    firm_line = f"<p><strong>Firm/Role:</strong> {body.firm_name}</p>" if body.firm_name else ""
    message_line = f"<p><strong>Message:</strong> {body.message}</p>" if body.message else ""
    return f"""
    <p>New waitlist signup:</p>
    <p><strong>Name:</strong> {body.full_name}</p>
    <p><strong>Email:</strong> {body.email}</p>
    {firm_line}
    {message_line}
    """


@router.post("", response_model=WaitlistResponse, status_code=201)
async def join_waitlist(body: WaitlistRequest, db: AsyncSession = Depends(get_db)):
    entry = WaitlistEntry(
        id=new_id(),
        email=body.email,
        full_name=body.full_name,
        firm_name=body.firm_name,
        message=body.message,
    )
    db.add(entry)
    await db.commit()

    await send_email(body.email, "You're on the LawInd waitlist", _visitor_email_html(body.full_name))
    await send_email(
        settings.founder_notify_email,
        f"New waitlist signup: {body.full_name}",
        _founder_email_html(body),
    )

    return WaitlistResponse()
