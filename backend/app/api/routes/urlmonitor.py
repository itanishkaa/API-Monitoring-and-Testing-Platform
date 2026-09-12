from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.url_monitor import UrlMonitor
from app.schemas.url_monitor import (
    UrlMonitorCreate,
    UrlMonitorResponse,
    UrlMonitorUpdate,
)
from app.services.monitor_service import (
    check_all,
    create_monitor,
    delete_monitor,
    update_monitor,
)

router = APIRouter(prefix="/api/urlmonitor", tags=["URL Monitors"])


def to_response(monitor: UrlMonitor) -> UrlMonitorResponse:
    return UrlMonitorResponse(
        id=monitor.id,
        name=monitor.name,
        url=monitor.url,
        expectedContent=monitor.expected_content,
        status=monitor.status,
        valid=monitor.valid,
        validUrl=monitor.valid_url,
        response=monitor.response,
        validResponse=monitor.valid_response,
        validContent=monitor.valid_content,
        responseTime=monitor.response_time,
        lastChecked=monitor.updated_on,
    )


@router.post("/add", response_model=UrlMonitorResponse)
def add_url_monitor(data: UrlMonitorCreate, db: Session = Depends(get_db)):
    return to_response(create_monitor(db, data))


@router.put("/update", response_model=UrlMonitorResponse)
def update_url_monitor(data: UrlMonitorUpdate, db: Session = Depends(get_db)):
    try:
        return to_response(update_monitor(db, data))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/delete")
def delete_url_monitor(data: UrlMonitorUpdate, db: Session = Depends(get_db)):
    deleted = delete_monitor(db, data.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Monitor not found")
    return True


@router.get("/allrecords", response_model=list[UrlMonitorResponse])
def validate_all_urls(db: Session = Depends(get_db)):
    return [to_response(monitor) for monitor in check_all(db)]
