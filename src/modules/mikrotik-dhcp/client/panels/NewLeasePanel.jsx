import React from "react";
import NewLease from "../components/NewLease";
import { useParams } from "react-router-dom";

export default function NewLeasePanel() {
    const params = useParams();

    return (
        <>
            <NewLease panelId={params.panelId} />
        </>
    );
}
