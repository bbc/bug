import React from "react";
import { useParams } from "react-router-dom";
import SourceSelector from "./../components/SourceSelector";

export default function MainPanel() {
    const params = useParams();
    return (
        <>
            <SourceSelector panelId={params.panelId} />
        </>
    );
}
