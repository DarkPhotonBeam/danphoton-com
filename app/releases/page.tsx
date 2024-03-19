"use client";
import css from 'page.module.scss';
import releases from '@/public/releases.json';
import Release from "@/app/components/Release/Release";
import Visualizer from "@/app/components/Visualizer/Visualizer";
import {useRecoilValue} from "recoil";
import {visualizerOverlayActiveState} from "@/app/recoilContextProvider";

export default function Releases() {
    const visuOverlayActive = useRecoilValue(visualizerOverlayActiveState);
    return (
        <main className={(!visuOverlayActive ? "hide" : "")}>
            <h1>Releases</h1>
            {
                releases.map((release, i) => <Release key={i} release={release} albumIndex={i} />)
            }
        </main>
    );
}