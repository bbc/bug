import React from "react";
import Lease from "../components/Lease";
import { useParams } from "react-router-dom";

export default function LeasePanel() {
    const params = useParams();

    return (
        <>
            <Lease panelId={params.panelId} leaseId={params.leaseId} />
        </>
    );
}
