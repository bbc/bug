import React from "react";
import LeaseList from "../components/LeaseList";
import { useParams } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <LeaseList panelId={params.panelId} />
        </>
    );
}
