import uuid
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.utils.pydantic import Status


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


class Service(db.Model):
    __tablename__ = "services"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(db.String(50), nullable=False)
    url: Mapped[str] = mapped_column(db.String(2048), nullable=False)
    check_interval_seconds: Mapped[int] = mapped_column(default=300)

    checks: Mapped[list["Check"]] = relationship(
        "Check", back_populates="service", cascade="all, delete-orphan"
    )

    created_at: Mapped[datetime] = mapped_column(
        server_default=db.func.now(), nullable=False
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "url": self.url,
            "check_interval": self.check_interval_seconds,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Check(db.Model):
    __tablename__ = "health_checks"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    service_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("services.id"),
    )

    service: Mapped["Service"] = relationship("Service", back_populates="checks")

    status: Mapped[Status] = mapped_column(Enum(Status))

    response_time_ms: Mapped[float] = mapped_column()

    created_at: Mapped[datetime] = mapped_column(server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "service_id": str(self.service_id),
            "status": self.status.value,
            "response_time": self.response_time_ms,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
