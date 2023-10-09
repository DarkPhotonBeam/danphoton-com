import Image from 'next/image'
import styles from './page.module.scss'
import Link from "next/link";

export interface ReleaseLink {
    title: string;
    url: string;
}

export interface Image {
    data: {
        id: number;
        attributes: {
            name: string
            alternativeText: any
            caption: any
            width: number
            height: number
            formats: {
                small: ImageFormat
                medium: ImageFormat
                large: ImageFormat
                thumbnail: ImageFormat
            }
            hash: string
            ext: string
            mime: string
            size: number
            url: string
            previewUrl: any
            provider: string
            provider_metadata: any
            createdAt: string
            updatedAt: string
        }
    }
}

export interface ImageFormat {
    ext: string
    url: string
    hash: string
    mime: string
    name: string
    path: any
    size: number
    width: number
    height: number
}


export interface Track {
    id: number;
    title: string;
}

export interface Release {
    id: number;
    attributes: {
        title: string;
        releaseDate: string;
        cover: Image;
        tracks: Track[];
        links: ReleaseLink[];
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }
}

/*

"title": "Liminal",
"releaseDate": "2023-08-08",
"createdAt": "2023-08-08T16:49:57.832Z",
"updatedAt": "2023-08-08T16:49:59.200Z",
"publishedAt": "2023-08-08T16:49:59.193Z"
 */

export interface Releases {
    data: Release[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    }
}

export default async function Home() {
    const data = await fetch('https://cms.danphoton.com/api/releases?populate=*');
    const releases: Releases = await data.json();
    console.log(releases);
    const latestRelease = releases.data[0] ?? null;

    if (latestRelease === null) {
        return <main className={styles.main}>No Content Error</main>
    }

    const coverAttributes = latestRelease.attributes.cover.data.attributes;

    return (
        <main className={styles.main}>
            <h1>&quot;{latestRelease.attributes.title}&quot; out now!</h1>
            <Image className={styles.image} src={`https://cms.danphoton.com${coverAttributes.url}`} priority={true} alt={"Cover"} width={coverAttributes.width} height={coverAttributes.height}></Image>
            <ul>
                {
                    latestRelease.attributes?.links?.map((link, i) => (
                        <li key={i}>
                            <Link href={link.url}>{link.title}</Link>
                        </li>
                    ))
                }
            </ul>
        </main>
    )
}
