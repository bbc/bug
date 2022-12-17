import React from "react";
import Output from "../components/Output";
import { useParams } from "react-router-dom";

export default function OutputPanel() {
    const params = useParams();

    return (
        <>
            <Output
                panelId={params.panelId}
                outputNumber={params.outputNumber}
            />
        </>
    );
}
