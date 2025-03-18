package api.monitoring.api.util;

import java.lang.module.ModuleDescriptor.Builder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.AsyncHttpClientConfig;
import com.ning.http.client.AsyncHttpClientConfig.Builder;

import api.monitoring.api.repository.UrlMonitorRestRepository;

@Component
public class UrlMonitorUtil {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private AsyncHttpClient  asyncHttpClient;

    @Autowired
    private UrlMonitorRestRepository repo;

    @Autowired
    private UrlMonitorValidator validator;

    public UrlMonitorUtil() {
        System.setProperty("jsse.enableSNIExtension", "false");

        Builder builder = new AsyncHttpClientConfig.Builder();

        
    }
}
