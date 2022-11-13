import React from "react";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugDetailsTable from "@core/BugDetailsTable";
import AxiosGet from "@utils/AxiosGet";
import { useForceRefresh } from "@hooks/ForceRefresh";
import { useAlert } from "@utils/Snackbar";

export default function TabChannels({ panelId }) {
    const sendAlert = useAlert();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const channels = useApiPoller({
        url: `/container/${panelId}/channels`,
        interval: 5000,
        forceRefresh: forceRefresh,
    });

    if (channels.status === "idle" || channels.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (channels.status === "success" && !channels.data) {
        return <BugNoData title="No channels found, please add some" showConfigButton={false} />;
    }

    return (
        <>
            <BugDetailsTable items={[]} />
        </>
    );
}
