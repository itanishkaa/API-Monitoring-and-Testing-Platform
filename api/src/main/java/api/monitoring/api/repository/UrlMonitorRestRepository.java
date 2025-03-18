package api.monitoring.api.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import api.monitoring.api.model.UrlMonitor;

@RestResource(path = "urlmonitors", rel = "urlmonitors")
public interface UrlMonitorRestRepository extends PagingAndSortingRepository<UrlMonitor, Long> {
    
}
