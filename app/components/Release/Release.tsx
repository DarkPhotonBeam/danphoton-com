"use client";
import css from './Release.module.scss';
import Image from "next/image";
import Link from "next/link";
import releases from '@/public/releases.json';
import {useState} from "react";
import {useRecoilState} from "recoil";
import { MdOutlineQueueMusic } from "react-icons/md";
import { PiQueueFill } from "react-icons/pi";
import {
    mmAudioElState,
    mmCurrentAlbumIndexState,
    mmCurrentIndexState,
    mmPlayNextState,
    mmQueueState
} from "@/app/recoilContextProvider";
import Logo from "@/app/components/Logo/Logo";

export interface ISong {
    title: string;
    key: string;
}

export interface ILink {
    platform: string;
    url: string;
}

export interface IRelease {
    title: string;
    key: string;
    songs: ISong[];
    releaseDate: string;
    links: ILink[];
}

export default function Release({release, subtitle, albumIndex} : {release: IRelease, subtitle?: string, albumIndex: number}) {
    return (
        <div className={css.main}>
            {
                subtitle ? <h2 className={css.subtitle}>{subtitle}</h2> : ""
            }
            <h1 className={css.title}>{release.title}</h1>
            <div className={css.container}>
                <div className={css.left}>
                    <Image src={`/static/pictures/covers/${release.key}.jpg`} alt={"Cover"} width={400} height={400}></Image>
                </div>
                <div className={css.right}>
                    <Songs albumIndex={albumIndex} songs={release.songs} />
                </div>
            </div>
            <div className={css.links}>
                {
                    release.links.map((link, i) => (
                        <Link target={"_blank"} key={i} href={link.url}><Logo platform={link.platform} /></Link>
                    ))
                }
            </div>
        </div>
    );
}

function Songs({songs, albumIndex}: {songs: ISong[], albumIndex: number}) {
    const [queue, setQueue] = useRecoilState(mmQueueState);
    const [playNext, setPlayNext] = useRecoilState(mmPlayNextState);
    const [audio, setAudio] = useRecoilState(mmAudioElState);
    const [currAlbum, setCurrAlbum] = useRecoilState(mmCurrentAlbumIndexState);
    const [currIndex, setCurrIndex] = useRecoilState(mmCurrentIndexState);

    const addToQueue = (index: number) => {
        const _queue = [...queue];
        _queue.push({albumIndex, index,});
        setQueue(_queue);
    };

    const addToPlayNext = (index: number) => {
        const _playNext = [...playNext];
        _playNext.unshift({albumIndex, index,});
        setPlayNext(_playNext);
    };

    const setCurrentAndPlay = (index: number) => {
        setCurrAlbum(albumIndex);
        console.log("bwen");
        setCurrIndex(index);
        const src = `/static/audio/${releases[albumIndex].key}/${releases[albumIndex].songs[index].key}.mp3`;
        if (audio == null) {
            const _audio = new Audio(src);
            setAudio(_audio);
            _audio.play().catch(e => console.log(e)).then((e) => {console.log(_audio)});
            console.log("huh");
        } else {
            audio.src = src;
            audio.play().then();
            //audio.src = src;
            //audio.play().then(r => {});
        }
    };

    return (
        <ul className={css.songs}>
            {
                songs.map((song, i) => (
                    <li className={css.song + (currAlbum === albumIndex && currIndex == i && audio != null ? " " + css.active : "")} key={i} onClick={() => setCurrentAndPlay(i)}>
                        <span>{song.title}</span>
                        {/*<span>*/}
                        {/*    <MdOutlineQueueMusic title={"Add to Queue"} />*/}
                        {/*    <PiQueueFill title={"Play next"} />*/}
                        {/*</span>*/}
                    </li>
                ))
            }
        </ul>
    );
}