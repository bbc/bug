import React from "react";
import GroupList from "../components/GroupList";
import { useParams } from "react-router-dom";

export default function TabPeers() {
    const params = useParams();

    return (
        <>
            <GroupList panelId={params.panelId} />
        </>
    );
}
