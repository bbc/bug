import React from "react";
import Router from "../components/Router";
import { useParams } from "react-router-dom";

export default function MainPanel(props) {
    const { panelId, sourceGroup, destinationGroup } = useParams();
    return (
        <>
            <Router
                panelId={panelId}
                sourceGroup={sourceGroup ? parseInt(sourceGroup) : 0}
                destinationGroup={destinationGroup ? parseInt(destinationGroup) : 0}
            />
        </>
    );
}
