"use client";
import {milli} from "@/app/lib/visualizerHelpers";

export default class TimeBufferedAvg {
    timeFrame: number;

    private data: {value: number, timestamp: number}[] = [];

    private average = 0;

    constructor(timeFrame: number = 10_000) {
        this.timeFrame = timeFrame;
    }

    add(value: number) {
        const now = milli();

        this.data.push({
            value,
            timestamp: now,
        });

        const filteredData = this.data.filter((entry) => now - entry.timestamp <= this.timeFrame);

        if (filteredData.length === 0) return;

        let avg = 0;

        for (const entry of filteredData) {
            avg += entry.value;
        }

        avg /= filteredData.length;

        this.average = avg;

        return avg;
    }

    get avg() {
        return this.average;
    }
}