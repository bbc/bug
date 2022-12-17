import React from "react";
import ProgramList from "../components/ProgramList";
import { useParams } from "react-router-dom";

export default function TabPeers() {
    const params = useParams();

    return (
        <>
            <ProgramList panelId={params.panelId} />
        </>
    );
}
