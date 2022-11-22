import React from "react";
import Map from "../components/Map";
import { useParams } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <Map panelId={params.panelId} />
        </>
    );
}
