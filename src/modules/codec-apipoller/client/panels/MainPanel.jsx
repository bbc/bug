import React from "react";
import CodecList from "../components/CodecList";

export default function MainPanel({ panelId }) {
    return (
        <>
            <CodecList panelId={panelId} />
        </>
    );
}
