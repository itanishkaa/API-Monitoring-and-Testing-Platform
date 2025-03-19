package api.monitoring.api.controller;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@ComponentScan
public class AboutController {

    @RequestMapping(value = {"/about"}, method = RequestMethod.GET)
    public String savePage(Model model) {
        return "about";
    }
}
