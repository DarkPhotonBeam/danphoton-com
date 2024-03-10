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

export const mmCurrentElapsedState = atom<number>({
    key: "mmCurrentElapsed",
    default: 0,
});

export const mmAudioElState = atom<HTMLAudioElement | null>({
    key: "mmAudioEl",
    default: null,
});

export default function RecoilContextProvider({ children }: { children: React.ReactNode }) {
    return <RecoilRoot>{children}</RecoilRoot>;
}