"use client";
import Image from "next/image";
import css from "./page.module.scss";
import releases from '@/public/releases.json';
import Release, {IRelease} from "@/app/components/Release/Release";
import Link from "next/link";
import Visualizer from "@/app/components/Visualizer/Visualizer";
import {useRecoilValue} from "recoil";
import {visualizerOverlayActiveState} from "@/app/recoilContextProvider";

export default function Home() {
    const latestRelease: IRelease = releases[0];
    const visuOverlayActive = useRecoilValue(visualizerOverlayActiveState);

    return (
        <main className={css.main + " " + (!visuOverlayActive ? "hide" : "")}>
            <Release albumIndex={0} release={latestRelease} subtitle={"Latest Release"} />

            <Link href={'/releases'}>All Releases</Link>
        </main>
    );
}
