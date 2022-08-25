package fr.an.spark.gateway.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import fr.an.spark.gateway.dto.SparkEvent;
import fr.an.spark.gateway.service.SparkEventService;
import lombok.val;

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

}
