import React from "react";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import BugStatusBlockContainer from "@core/BugStatusBlockContainer";

export default function ReceiverStatus({ panelId }) {
    const receiverStatus = useApiPoller({
        url: `/container/${panelId}/receiver/status`,
        interval: 5000,
    });

    if (receiverStatus.status === "loading" || receiverStatus.status === "idle") {
        return <BugLoading />;
    }

    return <BugStatusBlockContainer items={receiverStatus.data} />;
}
