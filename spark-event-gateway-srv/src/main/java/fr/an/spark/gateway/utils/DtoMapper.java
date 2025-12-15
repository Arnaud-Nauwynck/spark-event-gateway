package fr.an.spark.gateway.utils;

import lombok.RequiredArgsConstructor;
import ma.glasnost.orika.MapperFacade;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DtoMapper {

    private final MapperFacade mapperFacade;

    public <S, D> D map(S src, Class<D> destClass) {
        return mapperFacade.map(src, destClass);
    }

    public <S, D> List<D> map(Collection<S> src, Class<D> destClass) {
        return mapperFacade.mapAsList(src, destClass);
    }

}
