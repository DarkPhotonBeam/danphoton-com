"use client";
import css from './Visualizer.module.scss';
import {useRecoilState, useRecoilValue} from "recoil";
import {
    mmAudioElState,
    visAnalyzerState,
    visAudioCtxState,
    visAudioSrcState,
    visGainNodeState
} from "@/app/recoilContextProvider";
import {useCallback, useEffect, useRef} from "react";

export default function Visualizer() {
    const audio = useRecoilValue(mmAudioElState);
    const [audioCtx, setAudioCtx] = useRecoilState(visAudioCtxState);
    const [audioSrc, setAudioSrc] = useRecoilState(visAudioSrcState);
    const [analyzer, setAnalyzer] = useRecoilState(visAnalyzerState);
    const [gainNode, setGainNode] = useRecoilState(visGainNodeState);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const frame = useRef(0);

    const animate = useCallback(() => {
        if (canvasRef.current === null) return;
        const canvas = canvasRef.current;

        const ctx = canvas.getContext("2d");
        if (ctx === null) return;
        //console.log(analyzer);
        if (analyzer !== null) {
            const arr = new Uint8Array(analyzer?.fftSize);
            analyzer.getByteFrequencyData(arr);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "red";
            //console.log(arr[100]);
            //ctx.fillRect(0, 0, canvas.width, canvas.height * (arr[100]/255));
            for (let i = 0; i < canvas.width/2; i++) {
                const l = Math.floor((i / (canvas.width/2)) * arr.length*0.25);
                const h = arr[l]/255 * canvas.height;
                const mult = 0.3;
                ctx.fillStyle = `rgb(${arr[l]*mult}, ${30*mult}, ${i/canvas.width/2*255*mult})`;
                ctx.fillRect(i, canvas.height/2-h/2, 1, h);
                ctx.fillRect(canvas.width-i-1, canvas.height/2-h/2, 1, h);
            }
        }

        //ctx.fillStyle = "red";
        //ctx.fillRect(0, 0, 20, 20);
        //ctx.fillRect(canvas.width, 0, -20, 20);

        frame.current = requestAnimationFrame(animate);
    }, [analyzer]);

    const resizeHandler = () => {
        if (canvasRef.current === null) return;
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
    };

    useEffect(() => {
        if (audio === null || canvasRef === null) return;
        resizeHandler();
        window.onresize = resizeHandler;

        if (!audioCtx || !audioSrc || !analyzer) {
            const _audioCtx = new AudioContext();
            const _audioSrc = _audioCtx.createMediaElementSource(audio);
            const _analyzer = _audioCtx.createAnalyser();
            const _gainNode = _audioCtx.createGain();
            _audioSrc.connect(_analyzer);
            _analyzer.connect(_gainNode);
            _gainNode.connect(_audioCtx.destination);

            setAudioCtx(_audioCtx);
            setAudioSrc(_audioSrc);
            setAnalyzer(_analyzer);
            console.log(_analyzer);
            setGainNode(_gainNode);
        }

        frame.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frame.current);
        };
    }, [animate, audio, canvasRef]);

    return (
        <canvas className={css.canvas} ref={canvasRef}></canvas>
    );
}