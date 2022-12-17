import React from "react";
import VmList from "../components/VmList";

export default function MainPanel({ panelId }) {
    return (
        <>
            <VmList panelId={panelId} />
        </>
    );
}
