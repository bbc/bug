import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";

export default function AudioPlayer({ source, playing }) {
    return (
        <>
            <ReactPlayer hidden controls={true} playing={playing} url={source} />
        </>
    );
}
