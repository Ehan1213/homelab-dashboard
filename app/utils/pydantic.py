from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class ValidateService(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(..., max_length=50)
    url: str = Field(..., max_length=2048)
    check_interval_seconds: int | None = Field(300, ge=100)


class Status(str, Enum):
    up = "up"
    down = "down"
    degraded = "degraded"


class ValidateCheck(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: Status = Field(Status)
    response_time_ms: float | None = Field(None)
