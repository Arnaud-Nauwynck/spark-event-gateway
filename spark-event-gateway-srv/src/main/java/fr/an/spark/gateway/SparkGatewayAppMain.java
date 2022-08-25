package fr.an.spark.gateway;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

import fr.an.spark.gateway.service.SparkEventService;

@SpringBootApplication
public class SparkGatewayAppMain {

    public static void main(String[] args) {
        SpringApplication.run(SparkGatewayAppMain.class, args);
    }

}

@Component
class SparkGatewayInit implements CommandLineRunner {

    @Autowired
    protected SparkEventService sparkEventService;
    
    @Override
    public void run(String... args) throws Exception {
        sparkEventService.listEvents();
    }
    
}
