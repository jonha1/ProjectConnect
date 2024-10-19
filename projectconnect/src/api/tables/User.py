from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import TEXT, INTEGER

from .database import Base

class UserAccount(Base):
    __tablename__ = "user_account"

    user_id = Column(INTEGER, primary_key=True)
    name = Column(TEXT)
    email = Column(TEXT, nullable=False, unique=True)
    password = Column(TEXT)
