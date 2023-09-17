import React from "react";
import Router from "../components/Router";
import { useParams } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <Router
                panelId={params.panelId}
                sourceGroup={params.sourceGroup ?? 0}
                destinationGroup={params.destinationGroup ?? 0}
                editMode
            />
        </>
    );
}
