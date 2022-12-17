import React from "react";
import OutputsList from "../components/OutputsList";
import { useParams } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <OutputsList panelId={params.panelId} />
        </>
    );
}
