package fr.an.spark.gateway.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @AllArgsConstructor
public class MutableLong {

    @Getter @Setter
    public long value;

    public void incr() {
        this.value++;
    }
    public void decr() {
        this.value--;
    }
}
