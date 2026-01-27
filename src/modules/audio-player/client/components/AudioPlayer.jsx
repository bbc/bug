import { useAlert } from "@utils/Snackbar";
import { useRef } from "react";
import ReactPlayer from "react-player/lazy";

export default function AudioPlayer({ title, source, playing, volume, onPlayingChange }) {
    const sendAlert = useAlert();
    const player = useRef();

    const handleError = () => {
        // If there’s an error while trying to play, notify parent
        if (onPlayingChange) onPlayingChange(false);
        sendAlert(`Failed to play ${title}`, { broadcast: "false", variant: "error" });
    };

    const handleReady = () => {
        if (player.current) {
            const duration = player.current.getDuration();
            player.current.seekTo(duration, "seconds"); // jump to live point
        }
    };

    const handlePlay = () => {
        if (onPlayingChange) onPlayingChange(true);
    };

    const handlePause = () => {
        if (onPlayingChange) onPlayingChange(false);
    };

    return (
        <ReactPlayer
            hidden
            ref={player}
            controls={true}
            width="100%"
            height="50px"
            volume={volume}
            playing={playing}
            url={source}
            onError={handleError}
            onReady={handleReady}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={() => onPlayingChange && onPlayingChange(false)}
        />
    );
}
