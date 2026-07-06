import logging

import httpx

from config.settings import settings

logger = logging.getLogger("lawind.email")

RESEND_URL = "https://api.resend.com/emails"


async def send_email(to: str, subject: str, html: str) -> bool:
    if not settings.resend_api_key:
        logger.warning("RESEND_API_KEY not set - skipping email to %s (%s)", to, subject)
        return False

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            response = await client.post(
                RESEND_URL,
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json={
                    "from": settings.email_from,
                    "to": [to],
                    "subject": subject,
                    "html": html,
                },
            )
            response.raise_for_status()
            return True
        except httpx.HTTPError:
            logger.exception("Failed to send email to %s (%s)", to, subject)
            return False
