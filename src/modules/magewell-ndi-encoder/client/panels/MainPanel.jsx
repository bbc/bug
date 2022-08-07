import React from "react";
import { useParams } from "react-router-dom";
import DevicesTable from "./../components/DevicesTable";

export default function MainPanel() {
    const params = useParams();
    return <DevicesTable panelId={params.panelId} />;
}
