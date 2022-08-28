import React from "react";
import PeerList from "../components/PeerList";
import { useParams } from "react-router-dom";

export default function TabPeers() {
    const params = useParams();

    return (
        <>
            <PeerList panelId={params.panelId} />
        </>
    );
}
