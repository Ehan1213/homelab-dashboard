import uuid
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


class Service(db.Model):
    __tablename__ = "services"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(db.String(50))
    url: Mapped[str] = mapped_column(db.String(2048))
    check_interval_seconds: Mapped[int] = mapped_column(default=300)

    checks: Mapped[list["HealthCheck"]] = relationship(
        "HealthCheck", back_populates="service", cascade="all, delete-orphan"
    )
    created_at: Mapped[datetime] = mapped_column(server_default=db.func.now())


class HealthCheck(db.Model):
    __tablename__ = "health_checks"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    service_id: Mapped[uuid.UUID] = mapped_column(
        "services.id", ForeignKey("services.id")
    )

    service: Mapped["Service"] = relationship("Service", back_populates="checks")

    data: Mapped[dict] = mapped_column(JSON, nullable=False)

    created_at: Mapped[datetime] = mapped_column(server_default=db.func.now())
