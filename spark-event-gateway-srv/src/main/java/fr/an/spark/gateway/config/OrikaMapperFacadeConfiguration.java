package fr.an.spark.gateway.config;

import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.impl.DefaultMapperFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OrikaMapperFacadeConfiguration {

    @Bean
    public MapperFacade mapperFactory() {
        MapperFactory mapperFactory = new DefaultMapperFactory.Builder().build();
        // may configure here custom mappings

        return mapperFactory.getMapperFacade();
    }
}
