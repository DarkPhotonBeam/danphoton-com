"use client";
import css from './Visualizer.module.scss';
import {useRecoilState, useRecoilValue} from "recoil";
import {
    mmAudioElState,
    visAnalyzerState,
    visAudioCtxState,
    visAudioSrcState,
    visGainNodeState, visualizerOverlayActiveState,
} from "@/app/recoilContextProvider";
import {useCallback, useEffect, useRef, useState} from "react";
import {deltaToBpm, drawVisualizer, oldDraw} from "@/app/lib/visualizerHelpers";
import Trigger from "@/app/lib/Trigger";
import TimeBufferedAvg from "@/app/lib/TimeBufferedAvg";

export default function Visualizer() {
    const audio = useRecoilValue(mmAudioElState);
    const visualizerOverlayActive = useRecoilValue(visualizerOverlayActiveState);
    const [audioCtx, setAudioCtx] = useRecoilState(visAudioCtxState);
    const [audioSrc, setAudioSrc] = useRecoilState(visAudioSrcState);
    const [analyzer, setAnalyzer] = useRecoilState(visAnalyzerState);
    const [gainNode, setGainNode] = useRecoilState(visGainNodeState);


    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trigger1 = useRef<Trigger>(new Trigger(6, 1000));
    const last = useRef<number>(-1);
    const cnt1 = useRef<number>(0);
    const deltaAvg = useRef<TimeBufferedAvg>(new TimeBufferedAvg(10_000));

    const [bpm, setBpm] = useState(120);

    const frame = useRef(0);

    const animate = useCallback((time: number) => {
        if (last.current === -1) last.current = time;


        if (canvasRef.current === null) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx === null) return;

        if (analyzer !== null) {
            const arr = new Uint8Array(analyzer?.fftSize);
            analyzer.getByteFrequencyData(arr);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (trigger1.current.process(arr)) {
                const deltaTime = time - last.current;
                last.current = time;
                deltaAvg.current.add(deltaTime);
                cnt1.current = 1.0;
                console.log("Trigger");
                setBpm(deltaToBpm(deltaAvg.current.avg));
            }

            canvas.style.transform = `scale(${1+cnt1.current*0.6})`;
            const flashmax = visualizerOverlayActive ? 20 : 150;
            //console.log(bpm);

            const r = flashmax * cnt1.current;
            const g = flashmax * 0.5 * cnt1.current;
            const b = flashmax * cnt1.current;

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawVisualizer(ctx, arr, bpm);

            cnt1.current *= 0.9;
        }


        frame.current = requestAnimationFrame(animate);
    }, [analyzer, bpm, visualizerOverlayActive]);

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
        <div className={css.wrapper}>
            <canvas className={css.canvas} ref={canvasRef}></canvas>
            {
                visualizerOverlayActive ? <div className={css.overlay}></div> : ''
            }
            {
                process.env.NODE_ENV !== 'production' ? (
                    <div className={css.debug}>
                        <span>{bpm} bpm</span>
                    </div>
                ) : ''
            }
        </div>
    );
}