"use client";

export function drawVisualizer(ctx: CanvasRenderingContext2D, array: Uint8Array, bpm = 120) {
    const width = ctx.canvas.width;
    //console.log(width);
    const height = ctx.canvas.height;
    bpm = Math.min(bpm, 1000);
    const w = width/2;
    const now = milli();
    const magic = 230 + 50*Math.sin(now*0.01*(bpm/120)); // 148
    for (let x = 0; x < width; x++) {
        const i = Math.floor(Math.pow(Math.E, ((x%w)*array.length)/(magic*w))-1);

        const h = (array[i]/256) * (height*(0.7+(0.2*Math.sin((x/width * 4*Math.PI)+Math.PI/6+now*0.005*(bpm/120)))));

        const r = array[i];
        const g = 0;
        const b = (i/array.length)*255;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        const finalH = h * 0.8;

        ctx.fillRect(x >= w ? x : w-x, height/2+(finalH/2), 1, -finalH);
    }
}

export function oldDraw(ctx: CanvasRenderingContext2D, arr: Uint8Array) {
    for (let i = 0; i < ctx.canvas.width/2; i++) {
        const l = Math.floor((i / (ctx.canvas.width/2)) * arr.length*0.25);
        const h = arr[l]/255 * ctx.canvas.height;
        const mult = 0.3;
        ctx.fillStyle = `rgb(${arr[l]*mult}, ${30*mult}, ${i/ctx.canvas.width/2*255*mult})`;
        ctx.fillRect(i, ctx.canvas.height/2-h/2, 1, h);
        ctx.fillRect(ctx.canvas.width-i-1, ctx.canvas.height/2-h/2, 1, h);
    }
}

export function milli() {
    return (new Date()).getTime();
}

export function deltaToBpm(delta: number) {
    return 60_000/delta;
}