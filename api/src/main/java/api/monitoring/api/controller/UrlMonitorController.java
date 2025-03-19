package api.monitoring.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.monitoring.api.model.UrlMonitor;
import api.monitoring.api.repository.UrlMonitorRestRepository;
import api.monitoring.api.util.UrlMonitorUtil;

@RestController
@RequestMapping("/api/urlmonitor")
public class UrlMonitorController {
    
    @Autowired
    private UrlMonitorUtil util;

    @Autowired
    private UrlMonitorRestRepository repository;

    @PostMapping("/add")
    public UrlMonitor addUrlMonitor(@RequestBody UrlMonitor urlMonitor) {
        return util.validateAndSave(urlMonitor);
    }

    @PutMapping("/update")
    public UrlMonitor updateUrlMonitor(@RequestBody UrlMonitor urlMonitor) {
        return util.validateAndSave(urlMonitor);
    }

    @DeleteMapping("/delete")
    public boolean deleteUrlMonitor(@RequestBody UrlMonitor urlMonitor) {
        repository.delete(urlMonitor);
        return true;
    }

    @GetMapping("/allrecords")
    public Iterable<UrlMonitor> validateAllUrls() {
        return util.validateAndSaveAll();
    }
}
