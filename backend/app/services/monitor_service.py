from datetime import datetime, timezone
from time import perf_counter

import httpx
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.url_monitor import UrlMonitor
from app.schemas.url_monitor import UrlMonitorCreate, UrlMonitorUpdate


def validate_and_check(monitor: UrlMonitor) -> UrlMonitor:
    monitor.updated_on = datetime.now(timezone.utc).replace(tzinfo=None)

    try:
        # FastAPI/Pydantic already validates the URL format. The request check
        # records the HTTP result and optional expected-content validation.
        started = perf_counter()
        with httpx.Client(
            follow_redirects=True,
            timeout=settings.request_timeout_seconds,
        ) as client:
            response = client.get(monitor.url)
        elapsed_ms = round((perf_counter() - started) * 1000, 2)

        monitor.response_time = elapsed_ms
        monitor.response = str(response.status_code)
        monitor.valid_url = True
        monitor.valid_response = response.status_code == 200
        monitor.valid_content = True

        if monitor.expected_content:
            monitor.valid_content = monitor.expected_content in response.text

        monitor.valid = monitor.valid_response and monitor.valid_content
        monitor.status = "UP" if monitor.valid else "DOWN"

    except (httpx.HTTPError, ValueError) as exc:
        monitor.valid = False
        monitor.valid_url = True
        monitor.valid_response = False
        monitor.valid_content = False
        monitor.status = "DOWN"
        monitor.response = f"{type(exc).__name__}: {exc}"
        monitor.response_time = None

    return monitor


def create_monitor(db: Session, data: UrlMonitorCreate) -> UrlMonitor:
    monitor = UrlMonitor(
        name=data.name,
        url=str(data.url),
        expected_content=data.expected_content,
    )
    validate_and_check(monitor)
    db.add(monitor)
    db.commit()
    db.refresh(monitor)
    return monitor


def update_monitor(db: Session, data: UrlMonitorUpdate) -> UrlMonitor:
    monitor = db.get(UrlMonitor, data.id)
    if monitor is None:
        raise ValueError("Monitor not found")

    monitor.name = data.name
    monitor.url = str(data.url)
    monitor.expected_content = data.expected_content
    validate_and_check(monitor)

    db.commit()
    db.refresh(monitor)
    return monitor


def delete_monitor(db: Session, monitor_id: int) -> bool:
    monitor = db.get(UrlMonitor, monitor_id)
    if monitor is None:
        return False
    db.delete(monitor)
    db.commit()
    return True


def check_all(db: Session) -> list[UrlMonitor]:
    monitors = db.query(UrlMonitor).order_by(UrlMonitor.id.asc()).all()
    for monitor in monitors:
        validate_and_check(monitor)
    db.commit()
    for monitor in monitors:
        db.refresh(monitor)
    return monitors
