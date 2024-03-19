"use client";
export default class Trigger {
    callbacks: (() => void)[] = [];
    from = 0;
    to = 0;
    ratio = 1.2;

    avg = 0;
    sums: number[] = [];
    currSum = 0;

    lowCount = 0;

    constructor(from: number, to: number) {
        this.from = from;
        this.to = to;
    }

    process(array: Uint8Array) {
        const SCAN_LENGTH = 100;

        let sum = 0;
        for (let i = this.from; i < this.to; i++) {
            sum += array[i];
        }
        this.currSum += sum;
        if (this.sums.length < SCAN_LENGTH) {
            this.sums.push(sum);
        } else {
            const shiftedValue = this.sums.shift();
            if (shiftedValue === undefined) throw new Error("Tried shifting empty array");
            this.currSum -= shiftedValue;
            this.sums.push(sum);
        }
        this.avg = this.currSum / this.sums.length;
        //console.log(sum + " / " + this.avg);
        const MIN = 10_000;

        if (sum >= MIN && (sum / this.avg) >= this.ratio && this.lowCount > 24 && this.sums.length >= SCAN_LENGTH) {
            this.lowCount = 0;
            for (let i = 0; i < this.callbacks.length; i++) {
                this.callbacks[i]();
            }
            return true;
        } else {
            this.lowCount++;
            return false;
        }
    }
}