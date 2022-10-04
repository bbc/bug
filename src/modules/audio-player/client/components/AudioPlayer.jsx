import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { useAlert } from "@utils/Snackbar";

export default function AudioPlayer({ title, source, playing, volume }) {
    const sendAlert = useAlert();

    const handleError = (error) => {
        console.log(error);
        sendAlert(`Failed to play ${title}`, { broadcast: "false", variant: "error" });
    };
    return (
        <>
            <ReactPlayer hidden onError={handleError} controls={true} volume={volume} playing={playing} url={source} />
        </>
    );
}
