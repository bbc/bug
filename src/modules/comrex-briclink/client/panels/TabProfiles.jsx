import React from "react";
import ProfileList from "../components/ProfileList";
import { useParams } from "react-router-dom";

export default function TabProfiles() {
    const params = useParams();

    return (
        <>
            <ProfileList panelId={params.panelId} />
        </>
    );
}
