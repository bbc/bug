import React from "react";
import MpegEncoder from "../components/MpegEncoder";
import MpegEncoderStatus from "../components/MpegEncoderStatus";
import { useParams } from "react-router-dom";

export default function EncoderPanel({ panelId }) {
    const params = useParams();
    return (
        <>
            <MpegEncoderStatus panelId={panelId} serviceId={params.serviceId} />
            <MpegEncoder panelId={panelId} serviceId={params.serviceId} />
        </>
    );
}
