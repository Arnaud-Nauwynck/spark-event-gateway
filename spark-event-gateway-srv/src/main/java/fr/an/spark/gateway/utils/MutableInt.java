package fr.an.spark.gateway.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @AllArgsConstructor
public class MutableInt {

    @Getter @Setter
    public int value;

    public void incr() {
        this.value++;
    }
    public void decr() {
        this.value--;
    }

    public void addValue(int incr) {
        this.value += incr;
    }
}
