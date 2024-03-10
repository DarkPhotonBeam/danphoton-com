import css from 'page.module.scss';
import releases from '@/public/releases.json';
import Release from "@/app/components/Release/Release";

export default function Releases() {
    return (
        <main>
            <h1>Releases</h1>
            {
                releases.map((release, i) => <Release key={i} release={release} albumIndex={i} />)
            }
        </main>
    );
}