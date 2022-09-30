import React from "react";
// import PeerList from "../components/PeerList";
import { useParams } from "react-router-dom";

export default function TabPeers() {
    const params = useParams();

    return (
        <>
            Stats
            {/* <PeerList panelId={params.panelId} /> */}
        </>
    );
}
