import React from "react";
import OutputsTable from "../components/OutputsTable";
import { useParams } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <OutputsTable panelId={params.panelId} />
        </>
    );
}
