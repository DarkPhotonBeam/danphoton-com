import Image from "next/image";
import css from "./page.module.scss";
import releases from '@/public/releases.json';
import Release, {IRelease} from "@/app/components/Release/Release";
import Link from "next/link";

export default function Home() {
    const latestRelease: IRelease = releases[0];

    return (
        <main className={css.main}>
            <Release albumIndex={0} release={latestRelease} subtitle={"Latest Release"} />

            <Link href={'/releases'}>All Releases</Link>
        </main>
    );
}
