import React from "react";
import Example from "../components/Example";

export default function MainPanel({ panelId }) {
    return (
        <>
            <Example panelId={panelId} />
        </>
    );
}
