import React from "react";
import PeerAdd from "../components/PeerAdd";
import { useParams } from "react-router-dom";

export default function PeerAddPanel() {
    const params = useParams();

    return (
        <>
            <PeerAdd panelId={params.panelId} />
        </>
    );
}
