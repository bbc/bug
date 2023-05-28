import React from "react";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import BugStatusBlockContainer from "@core/BugStatusBlockContainer";

export default function CodecStatus({ panelId, serviceId }) {
    const codecstatus = useApiPoller({
        url: `/container/${panelId}/mpegencoderservice/status/${encodeURIComponent(serviceId)}`,
        interval: 2000,
    });

    if (codecstatus.status === "loading" || codecstatus.status === "idle") {
        return <BugLoading />;
    }

    return <BugStatusBlockContainer items={codecstatus.data} />;
}
