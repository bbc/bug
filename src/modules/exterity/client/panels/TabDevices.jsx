import React from "react";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugDetailsTable from "@core/BugDetailsTable";
import AxiosGet from "@utils/AxiosGet";
import { useForceRefresh } from "@hooks/ForceRefresh";
import { useAlert } from "@utils/Snackbar";

export default function TabDevices({ panelId }) {
    const sendAlert = useAlert();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const devices = useApiPoller({
        url: `/container/${panelId}/devices`,
        interval: 5000,
        forceRefresh: forceRefresh,
    });

    if (devices.status === "idle" || devices.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (devices.status === "success" && !devices.data) {
        return <BugNoData title="No devices found, please add some" showConfigButton={false} />;
    }

    return (
        <>
            <BugDetailsTable items={[]} />
        </>
    );
}
