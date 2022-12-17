import React from "react";
import InterfaceList from "../components/InterfaceList";
import { useParams } from "react-router-dom";

export default function MainPanel({ panelId }) {
    //TODO params.panelId or panelID? You choose.
    const params = useParams();

    return (
        <>
            <InterfaceList panelId={params.panelId} />
        </>
    );
}
