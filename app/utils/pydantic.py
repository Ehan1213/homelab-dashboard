from enum import Enum

from pydantic import BaseModel, Field


class ValidateService(BaseModel):
    name: str = Field(..., max_length=50)
    url: str = Field(..., max_length=2048)
    check_interval_seconds: int | None = Field(300, ge=100)


class Status(str, Enum):
    up = "up"
    down = "down"
    degraded = "degraded"


class ValidateCheck(BaseModel):
    status: Status = Field(Status)
    response_time: float | None = Field(None)
