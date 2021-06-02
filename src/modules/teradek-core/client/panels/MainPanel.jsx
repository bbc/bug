import React from "react";
import Encoders from "../components/Encoders";
import { useParams } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <Encoders panelId={params.panelId} />
        </>
    );
}
