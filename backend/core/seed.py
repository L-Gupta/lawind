from sqlalchemy import select

from core.database import AsyncSessionLocal
from core.founders import FOUNDER_DEFAULT_PASSWORD, FOUNDER_EMAILS, FOUNDER_NAMES
from core.security import hash_password, new_id
from models.user import PlanType, User


async def seed_founders():
    async with AsyncSessionLocal() as session:
        for email in FOUNDER_EMAILS:
            result = await session.execute(select(User).where(User.email == email))
            if result.scalar_one_or_none():
                continue

            user = User(
                id=new_id(),
                email=email,
                hashed_password=hash_password(FOUNDER_DEFAULT_PASSWORD),
                full_name=FOUNDER_NAMES.get(email, email.split("@")[0]),
                plan=PlanType.enterprise,
                is_verified=True,
            )
            session.add(user)

        await session.commit()
