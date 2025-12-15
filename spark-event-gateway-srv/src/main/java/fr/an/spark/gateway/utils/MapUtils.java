package fr.an.spark.gateway.utils;

import lombok.val;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Function;

public class MapUtils {

    public static <T,K> Map<K,T> toMap(Collection<T> src, Function<T,K> keyFunc) {
        val res = new LinkedHashMap<K,T>(src.size());
        for(val e : src) {
            K key = keyFunc.apply(e);
            if (key != null) {
                res.put(key, e);
            }
        }
        return res;
    }

    public static <T,K,V> Map<K,V> toMap(Collection<T> src, Function<T,K> keyFunc, Function<T,V> valFunc) {
        val res = new LinkedHashMap<K,V>(src.size());
        for(val e : src) {
            K key = keyFunc.apply(e);
            if (key != null) {
                res.put(key, valFunc.apply(e));
            }
        }
        return res;
    }

    public static <K,V> Map<K,V> toOverridedMap(Map<K,V> props, Map<K,V> baseProps) {
        val res = new LinkedHashMap<K,V>();
        for (val e : props.entrySet()) {
            val k = e.getKey();
            val v = e.getValue();
            val baseV = baseProps.get(k);
            if (baseV == null || !v.equals(baseV)) {
                res.put(k, v);
            }
        }
        return res;
    }

}
