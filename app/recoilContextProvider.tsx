"use client";

import { RecoilRoot, atom } from "recoil";

export const mmQueueState = atom<{albumIndex: number, index: number}[]>({
    key: "mmQueue",
    default: [],
});

export const mmPlayNextState = atom<{albumIndex: number, index: number}[]>({
    key: "mmPlayNext",
    default: [],
});

export const mmCurrentAlbumIndexState = atom<number>({
    key: "mmCurrentAlbumIndex",
    default: 0,
});

export const mmCurrentIndexState = atom<number>({
    key: "mmCurrentIndex",
    default: 0,
});

export const visAudioCtxState = atom<AudioContext | null>({
    key: "visAudioCtx",
    default: null,
});

export const visAudioSrcState = atom<MediaElementAudioSourceNode | null>({
    key: "visAudioSrc",
    default: null
});

export const visGainNodeState = atom<GainNode | null>({
    key: "visGainNode",
    default: null,
});

export const visAnalyzerState = atom<AnalyserNode | null>({
    key: "visAnalyzer",
    default: null
});

export const mmCurrentElapsedState = atom<number>({
    key: "mmCurrentElapsed",
    default: 0,
});

export const mmAudioElState = atom<HTMLAudioElement | null>({
    key: "mmAudioEl",
    default: null,
});

export const visualizerOverlayActiveState = atom<boolean>({
    key: "visualizerOverlayActive",
    default: true,
});

export default function RecoilContextProvider({ children }: { children: React.ReactNode }) {
    return <RecoilRoot>{children}</RecoilRoot>;
}