package fr.an.spark.gateway.rest;

import fr.an.spark.gateway.dto.SparkEvent;
import fr.an.spark.gateway.service.SparkEventService;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/spark-event")
public class SparkEventGateway {

    @Autowired
    SparkEventService delegate;
    
    @GetMapping(path = "/all")
    public List<SparkEvent> list() {
    	val res = delegate.listEvents();
        return res;
    }

    @GetMapping(path = "/{eventNum}")
    public SparkEvent findByNum(@PathVariable("eventNum") int eventNum) {
        val ls = delegate.listEvents();
        val res = (0 < eventNum && eventNum <= ls.size())? ls.get(eventNum - 1) : null;
        return res;
    }
}
