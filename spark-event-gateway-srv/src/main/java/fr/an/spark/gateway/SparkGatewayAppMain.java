package fr.an.spark.gateway;

import fr.an.spark.gateway.service.SparkEventsReader;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class SparkGatewayAppMain {

    public static void main(String[] args) {
        SpringApplication.run(SparkGatewayAppMain.class, args);
    }

}

@Component
@RequiredArgsConstructor
class SparkGatewayInit implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        // sparkEventService.listEvents();
    }
    
}
