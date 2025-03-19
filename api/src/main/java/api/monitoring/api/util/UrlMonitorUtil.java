package api.monitoring.api.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.AsyncHttpClientConfig;
import com.ning.http.client.Response;

import api.monitoring.api.ApiApplication;
import api.monitoring.api.model.UrlMonitor;
import api.monitoring.api.repository.UrlMonitorRestRepository;

@Component
public class UrlMonitorUtil {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private AsyncHttpClient  asyncHttpClient;

    @Autowired
    private UrlMonitorRestRepository repo;

    @Autowired
    private UrlMonitorValidator validator;

    public UrlMonitorUtil(ApiApplication apiApplication) {
        System.setProperty("jsse.enableSNIExtension", "false");

        com.ning.http.client.AsyncHttpClientConfig.Builder builder = new AsyncHttpClientConfig.Builder();

        builder.setAllowPoolingSslConnections(true)
                .setAllowPoolingSslConnections(true)
                .setFollowRedirect(true)
                .setAcceptAnyCertificate(true)
                .setEnabledProtocols(new String[] {
                    "TLSv1.2", "TLSv1.1", "TLSv1", "SSLv3", "SSLv2Hello"
                });
        
        asyncHttpClient = new AsyncHttpClient(builder.build());
    }

    public Iterable<UrlMonitor> validateAndSaveAll() {
        Collection<UrlMonitor> urlMonitorList = new ArrayList<UrlMonitor>();

        for(UrlMonitor urlMonitor : repo.findAll()) {
            urlMonitorList.add(this.validateAndSave(urlMonitor));
        }

        return urlMonitorList;
    }

    public UrlMonitor validateAndSave(UrlMonitor urlMonitor) {
        urlMonitor.setUpdatedOn(new Date());
        try {
            urlMonitor = this.validateUrlMonitor(urlMonitor);
            urlMonitor = repo.save(urlMonitor);
        } catch (Exception e) {
            urlMonitor.setResponse(e.getClass().getSimpleName()+": "+e.getMessage());
            urlMonitor.setValid(false);
            urlMonitor.setValidContent(false);
            urlMonitor.setValidResponse(false);

            urlMonitor = repo.save(urlMonitor);
        }
        return urlMonitor;
    }

    public UrlMonitor validateUrlMonitor(UrlMonitor urlMonitor) throws InterruptedException, ExecutionException, IOException {
        urlMonitor.setValid(true);
        urlMonitor.setValidUrl(true);
        urlMonitor.setValidResponse(true);
        urlMonitor.setValidContent(true);

        this.validator.validateUrlFormat(urlMonitor);

        if(!urlMonitor.isValid()) {
            return urlMonitor;
        }

        Response response = this.getResponse(urlMonitor.getUrl());

        this.validator.vaildateResponseCode(response, urlMonitor);
        this.validator.validateExpectedContent(response, urlMonitor);

        if(log.isDebugEnabled()) {
            log.debug("Validated URL Monitor: " + urlMonitor.toString());
        }

        return urlMonitor;
    }

    public Response getResponse(String url) throws InterruptedException, ExecutionException {
        return asyncHttpClient.prepareGet(url).execute().get();
    }
}
