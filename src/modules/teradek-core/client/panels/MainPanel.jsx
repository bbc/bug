import React from "react";
import Devices from "../components/Devices";
import Loading from "@components/Loading";
import { useParams } from "react-router-dom";
import { useApiPoller } from "@utils/ApiPoller";

export default function MainPanel() {
    const params = useParams();

    const devices = useApiPoller({
        url: `/container/${params?.panelId}/device/all`,
        interval: 5000,
    });

    if (devices.status === "loading" || devices.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Devices devices={devices.data} panelId={params.panelId} />
        </>
    );
}
