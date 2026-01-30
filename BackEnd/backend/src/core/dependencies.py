#backend/src/core/dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_async_session
async def get_db_session() -> AsyncSession:
    async with get_async_session() as session:
        yield session
def get_db() -> AsyncSession:
    return Depends(get_db_session)
# This function can be used as a dependency in FastAPI routes to provide a database session
# Example usage in a FastAPI route:
# from fastapi import APIRouter
# router = APIRouter()
# @router.get("/items/")

# async def read_items(db: AsyncSession = get_db()):
#     result = await db.execute("SELECT * FROM items")
#     items = result.fetchall()
#     return items

