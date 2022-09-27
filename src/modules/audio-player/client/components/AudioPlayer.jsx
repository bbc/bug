import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";

export default function AudioPlayer({ source, playing, volume }) {
    return (
        <>
            <ReactPlayer hidden controls={true} volume={volume} playing={playing} url={source} />
        </>
    );
}
