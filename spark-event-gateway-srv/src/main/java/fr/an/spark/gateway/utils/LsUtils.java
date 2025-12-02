package fr.an.spark.gateway.utils;

import fr.an.spark.gateway.eventTrackers.model.StageTracker;
import lombok.AllArgsConstructor;
import lombok.val;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

public class LsUtils {

    public static <T,U> List<U> map(Collection<T> src, Function<T,U> mapFunc) {
        List<U> res = new ArrayList<>(src.size());
        for (T item : src) {
            res.add(mapFunc.apply(item));
        }
        return res;
    }

    public static <T> int mapSumInt(Collection<T> src, Function<T,Integer> mapFunc) {
        int res = 0;
        for (T item : src) {
            res += mapFunc.apply(item);
        }
        return res;
    }

    public static <T> long mapSumLong(Collection<T> src, Function<T,Long> mapFunc) {
        long res = 0;
        for (T item : src) {
            res += mapFunc.apply(item);
        }
        return res;
    }

    public static <T> List<T> filter(Collection<T> src, Predicate<T> predicate) {
        List<T> res = new ArrayList<>(src.size());
        for (T item : src) {
            if (predicate.test(item)) {
                res.add(item);
            }
        }
        return (res.size() < src.size())? new ArrayList<>(res) : res;
    }

    public static <T,U> List<U> filterMap(Collection<T> src, Predicate<T> predicate, Function<T,U> mapFunc) {
        List<U> res = new ArrayList<>(src.size());
        for (T item : src) {
            if (predicate.test(item)) {
                res.add(mapFunc.apply(item));
            }
        }
        return (res.size() < src.size())? new ArrayList<>(res) : res;
    }

    public static <T> T findFirst(Collection<T> src, Predicate<T> predicate) {
        for (T item : src) {
            if (predicate.test(item)) {
                return item;
            }
        }
        return null;
    }

    public static <T> T findFirstOrAdd(Collection<T> src, Predicate<T> predicate, Supplier<T> supplier) {
        T res = findFirst(src, predicate);
        if (res == null) {
            res = supplier.get();
            src.add(res);
        }
        return res;
    }


    @AllArgsConstructor
    private static class KeyEntryForCompare<T,K> {
        public final K key;
        public final T entry;
    }

    public static <T,K> List<T> sortBy(Collection<T> src, Function<T,K> keyFunc) {
        List<KeyEntryForCompare<T, K>> ls = map(src, x -> new KeyEntryForCompare<>(keyFunc.apply(x), x));
        ls.sort((l,r)-> {
            @SuppressWarnings("unchecked")
            val lKey = ((Comparable<K>) l.key);
            return lKey.compareTo(r.key);
        });
        return map(ls, x -> x.entry);
    }
}
