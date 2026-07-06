from typing import Optional

from pydantic import BaseModel, EmailStr


class WaitlistRequest(BaseModel):
    email: EmailStr
    full_name: str
    firm_name: Optional[str] = None
    message: Optional[str] = None


class WaitlistResponse(BaseModel):
    status: str = "ok"
