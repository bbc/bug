import React from "react";
import Decoder from "../components/decoders/Decoder";
import { useParams } from "react-router-dom";

export default function DecoderPanel() {
    const params = useParams();

    return (
        <>
            <Decoder panelId={params.panelId} decoderId={params.decoderId} />
        </>
    );
}
