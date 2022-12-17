import React from "react";
import RouteList from "../components/RouteList";
import { useParams } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <RouteList panelId={params.panelId} />
        </>
    );
}
