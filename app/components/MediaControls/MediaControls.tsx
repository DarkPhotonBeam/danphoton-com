"use client";

import css from './MediaControls.module.scss';
import {useRecoilState, useRecoilValue} from "recoil";
import { FaPlay, FaBackwardStep, FaForwardStep, FaPause, FaVideo, FaVideoSlash } from "react-icons/fa6";
import {
    mmAudioElState,
    mmCurrentAlbumIndexState, mmCurrentElapsedState,
    mmCurrentIndexState,
    mmPlayNextState,
    mmQueueState, visGainNodeState, visualizerOverlayActiveState
} from "@/app/recoilContextProvider";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import releases from '@/public/releases.json';
import Link from "next/link";

export default function MediaControls() {
    const [queue, setQueue] = useRecoilState(mmQueueState);
    const [playNextQueue, setPlayNextQueue] = useRecoilState(mmPlayNextState);
    const [audio, setAudio] = useRecoilState(mmAudioElState);
    const [currentIndex, setCurrentIndex] = useRecoilState(mmCurrentIndexState);
    const [currentAlbumIndex, setCurrentAlbumIndex] = useRecoilState(mmCurrentAlbumIndexState);
    const [currentElapsed, setCurrentElapsed] = useRecoilState(mmCurrentElapsedState);
    const [visuOverlayActive, setVisuOverlayActive] = useRecoilState(visualizerOverlayActiveState);
    const gainNode = useRecoilValue(visGainNodeState);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const range = useRef<HTMLInputElement>(null);
    const [volume, setVolume] = useState(1);
    const [ready, setReady] = useState(false);


    const playNext = () => {
        if (audio == null) return;
        let newIndex;
        let newAlbumIndex;
        if (currentIndex < releases[currentAlbumIndex].songs.length-1) {
            newIndex = currentIndex + 1;
            newAlbumIndex = currentAlbumIndex;
        } else {
            //console.log(releases.length);
            newAlbumIndex = (currentAlbumIndex + 1) % releases.length;
            newIndex = 0;
        }
        setCurrentIndex(newIndex);
        setCurrentAlbumIndex(newAlbumIndex);
        audio.src = getSrc(newAlbumIndex, newIndex);
        audio.play().then();
    };

    useEffect(() => {
        setReady(false);
    }, [currentIndex, currentAlbumIndex]);

    useEffect(() => {
        if (audio == null) return;
        //setReady(false);
        if (range.current) range.current.value = "0";
        audio.onpause = () => setIsPlaying(false);
        audio.onplay = () => setIsPlaying(true);
        audio.onloadedmetadata = () => setReady(true);
        audio.ontimeupdate = () => {
            if (range.current) range.current.value = "" + (audio.currentTime / audio.duration);
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
        };
        audio.onended = () => playNext();
    }, [audio, range, currentIndex, currentAlbumIndex]);

    const scrub = (e: any) => {
        if (range == null || audio == null) return;
        console.log(e.target.value);
        const val = parseFloat(e.target.value);
        audio.currentTime = val * audio.duration;
    };

    function formatTime(val: number) {
        const minutes = Math.floor(val / 60);
        const seconds = Math.floor(val % 60);
        const strMinutes = minutes < 10 ? "0" + minutes : minutes;
        const strSeconds = seconds < 10 ? "0" + seconds : seconds;
        return strMinutes + ":" + strSeconds;
    }

    const getSrc = (albumIndex: number, index: number) => {
        return `/static/audio/${releases[albumIndex].key}/${releases[albumIndex].songs[index].key}.mp3`;
    };

    const playPrev = () => {
        if (audio == null) return;
        let newAlbumIndex;
        let newIndex;
        if (currentIndex > 0) {
            newIndex = currentIndex - 1;
            newAlbumIndex = currentAlbumIndex;
        } else {
            newAlbumIndex = currentAlbumIndex === 0 ? releases.length-1 : currentAlbumIndex - 1;
            newIndex = releases[newAlbumIndex].songs.length-1;
        }
        setCurrentAlbumIndex(newAlbumIndex);
        setCurrentIndex(newIndex);
        //console.log(currentAlbumIndex + ", " + currentIndex);
        audio.src = getSrc(newAlbumIndex, newIndex);
        audio.play().then();
    };

    const changeVolume = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(parseFloat(e.target.value));
        if (audio === null) return;
        //audio.volume = val;
        if (gainNode === null) return;
        gainNode.gain.value = val;
    };

    if (audio == null || !ready) return "";

    return (
        <div className={css.main}>
            <div className={css.upper}>
                <div className={css.titleWrapper}>
                    {releases[currentAlbumIndex].songs[currentIndex].title}
                </div>
                <div className={css.controls}>
                    <FaBackwardStep onClick={playPrev} />
                    {
                        !isPlaying ? <FaPlay onClick={() => audio.play()} /> : <FaPause onClick={() => audio.pause()} />
                    }
                    <FaForwardStep onClick={playNext} />
                    {
                        visuOverlayActive ? <FaVideo onClick={() => setVisuOverlayActive(false)} /> : <FaVideoSlash onClick={() => setVisuOverlayActive(true)} />
                    }
                </div>
                <div className={css.volumeWrapper}>
                    <input title={"Volume"} max={1} min={0} step={0.0001} value={volume} type={'range'} onChange={changeVolume} className={css.volume} />
                </div>
            </div>
            <div className={css.lower}>
                <span>{formatTime(currentTime)}</span>
                <input ref={range} max={1} step={0.0001} type={'range'} className={css.range} onInput={e => scrub(e)} />
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
}