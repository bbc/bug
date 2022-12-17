import React from "react";
import { useParams } from "react-router-dom";
import SourcesTable from "./../components/SourcesTable";

export default function MainPanel() {
    const params = useParams();

    return <SourcesTable panelId={params.panelId} />;
}
