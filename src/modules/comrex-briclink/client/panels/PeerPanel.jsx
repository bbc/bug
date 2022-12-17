import React from "react";
import Peer from "../components/Peer";
import { useParams } from "react-router-dom";

export default function PeerPanel() {
    const params = useParams();

    return (
        <>
            <Peer panelId={params.panelId} peerId={params.peerId} />
        </>
    );
}
