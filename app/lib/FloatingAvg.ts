"use client";
export default class FloatingAvg {
    max: number;
    sums: number[] = [];
    avg = 0;
    currSum = 0;

    constructor(max: number) {
        this.max = max;
    }

    add(data: number) {
        this.currSum += data;
        if (this.sums.length < this.max) {
            this.sums.push(data);
        } else {
            const shiftedValue = this.sums.shift();
            if (shiftedValue === undefined) throw new Error("Tried shifting empty array");
            this.currSum -= shiftedValue;
            this.sums.push(data);
        }
        this.avg = this.currSum / this.sums.length;
        return this.avg;
    }
}