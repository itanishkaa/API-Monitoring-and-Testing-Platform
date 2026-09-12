from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class UrlMonitorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    url: HttpUrl
    expected_content: str | None = None


class UrlMonitorCreate(UrlMonitorBase):
    pass


class UrlMonitorUpdate(UrlMonitorBase):
    id: int


class UrlMonitorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    url: str
    expectedContent: str | None = None
    status: str
    valid: bool
    validUrl: bool
    response: str | None = None
    validResponse: bool
    validContent: bool
    responseTime: float | None = None
    lastChecked: datetime | None = None
