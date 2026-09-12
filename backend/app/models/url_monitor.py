from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class UrlMonitor(Base):
    __tablename__ = "url_monitors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(2048), nullable=False, unique=True, index=True)
    expected_content: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(String(20), nullable=False, default="UNKNOWN")
    valid: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    valid_url: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    valid_response: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    valid_content: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    response: Mapped[str | None] = mapped_column(String(255), nullable=True)
    response_time: Mapped[float | None] = mapped_column(Float, nullable=True)
    updated_on: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
