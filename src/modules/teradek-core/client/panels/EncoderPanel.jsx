import React from "react";
import Encoder from "../components/Encoder.jsx";
import { useParams } from "react-router-dom";

export default function EncoderPanel() {
    const params = useParams();

    return (
        <>
            <Encoder panelId={params.panelId} encoderId={params.encoderId} />
        </>
    );
}
