package fr.an.spark.gateway.eventlog.model;

public class ExecutorMetrics { // TOCHECK

    public long[] metrics;

    public boolean compareAndUpdatePeakValues(ExecutorMetrics other) {
        boolean updated = false;
        int count = Math.min(this.metrics.length, other.metrics.length);
        for(int idx = 0; idx < count; idx++) {
            if (other.metrics[idx] > this.metrics[idx]) {
                updated = true;
                this.metrics[idx] = other.metrics[idx];
            }
        }
        return updated;
    }

}
