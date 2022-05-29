import React from "react";
import PeerList from "../components/PeerList";

export default function MainPanel({ panelId }) {
    return (
        <>
            <PeerList panelId={panelId} />
        </>
    );
}
