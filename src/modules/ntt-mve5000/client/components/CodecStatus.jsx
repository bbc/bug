import React from "react";
import Loading from "@components/Loading";
import { useApiPoller } from "@hooks/ApiPoller";
import BugStatusBlockContainer from "@core/BugStatusBlockContainer";

export default function CodecStatus({ panelId }) {
    const codecstatus = useApiPoller({
        url: `/container/${panelId}/codecstatus/`,
        interval: 5000,
    });

    if (codecstatus.status === "loading" || codecstatus.status === "idle") {
        return <Loading />;
    }

    return <BugStatusBlockContainer items={codecstatus.data} />;
}
