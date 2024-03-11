import {SiSpotify, SiApplemusic, SiDeezer, SiTidal, SiYoutubemusic, SiYoutube} from 'react-icons/si';

export default function Logo({platform, className}: {platform: string, className?: string}) {
    switch (platform) {
        case 'Spotify':
            return <SiSpotify title={"Spotify"} className={className} />
        case 'AppleMusic':
            return <SiApplemusic title={"Apple Music"} className={className} />
        case 'Deezer':
            return <SiDeezer title={"Deezer"} className={className} />
        case 'Tidal':
            return <SiTidal title={"Tidal"} className={className} />
        case 'YouTubeMusic':
            return <SiYoutubemusic title={"YouTube Music"} className={className} />
        case 'YouTube':
            return <SiYoutube title={"YouTube"} className={className} />
        default:
            return "";
    }
}