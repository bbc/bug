import { useAlert } from "@utils/Snackbar";
import ReactPlayer from "react-player/lazy";

export default function AudioPlayer({ title, source, playing, volume, onPlayingChange, onActiveChange }) {
    const sendAlert = useAlert();

    const handleError = () => {
        // If there’s an error while trying to play, notify parent
        if (onPlayingChange) onPlayingChange(false);
        if (onActiveChange) onActiveChange(false);
        sendAlert(`Failed to play ${title}`, { broadcast: "false", variant: "error" });
    };

    // Only mount the player while playing. This guarantees the stream is never
    // loaded (and cannot autoplay) on page load, and is fully torn down when
    // paused. A freshly mounted live HLS stream starts at the live edge.
    if (!playing) {
        return null;
    }

    return (
        <ReactPlayer
            hidden
            controls={true}
            width="100%"
            height="50px"
            volume={volume}
            playing={true}
            url={source}
            onError={handleError}
            onPlay={() => onActiveChange && onActiveChange(true)}
            onBuffer={() => onActiveChange && onActiveChange(false)}
            onBufferEnd={() => onActiveChange && onActiveChange(true)}
            onPause={() => onActiveChange && onActiveChange(false)}
            onEnded={() => {
                if (onPlayingChange) onPlayingChange(false);
                if (onActiveChange) onActiveChange(false);
            }}
        />
    );
}
