import React from "react";
import ExampleList from "../components/ExampleList";

export default function MainPanel({ panelId }) {
    return (
        <>
            <ExampleList panelId={panelId} />
        </>
    );
}
