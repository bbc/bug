import React, { useRef, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import { useAlert } from "@utils/Snackbar";

export default function AudioPlayer({ title, source, playing, volume }) {
    const sendAlert = useAlert();
    const player = useRef();

    const handleError = (error) => {
        if (playing) {
            sendAlert(`Failed to play ${title}`, { broadcast: "false", variant: "error" });
        }
    };

    // restart Player to latest available time
    useEffect(() => {
        const setTime = async () => {
            const duration = await player.current.getDuration();
            player.current.seekTo(duration, "seconds");
        };
        setTime();
    }, [playing]);

    return (
        <>
            <ReactPlayer
                ref={player}
                hidden
                onError={handleError}
                controls={true}
                volume={volume}
                playing={playing}
                url={source}
            />
        </>
    );
}
