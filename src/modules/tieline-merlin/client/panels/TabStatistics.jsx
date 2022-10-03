import React from "react";
import StatisticsList from "../components/StatisticsList";
import { useParams } from "react-router-dom";

export default function TabPeers() {
    const params = useParams();

    return (
        <>
            <StatisticsList panelId={params.panelId} />
        </>
    );
}
