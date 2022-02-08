import React from "react";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";
import Loading from "@components/Loading";
import BugDetailsTable from "@core/BugDetailsTable";
import BugNoData from "@core/BugNoData";

export default function InterfaceTabDetails({ panelId, interfaceName }) {
    const iface = useApiPoller({
        url: `/container/${panelId}/interface/${interfaceName}`,
        interval: 5000,
    });

    if (iface.status === "idle" || iface.status === "loading") {
        return <Loading height="30vh" />;
    }
    if (iface.status === "success" && !iface.data) {
        return <BugNoData title="Interface not found" showConfigButton={false} />;
    }

    return (
        <>
            <Grid item xs={12}>
                <BugDetailsTable
                    items={[
                        { name: "Name", value: iface.data?.name },
                        { name: "Comment", value: iface.data?.comment },
                        { name: "Running", value: iface.data?.running ? "yes" : "no" },
                        { name: "Disabled", value: iface.data?.disabled ? "yes" : "no" },
                        { name: "Type", value: iface.data?.type },
                        { name: "MAC Address", value: iface.data?.["mac-address"] },
                        { name: "Last link up time", value: iface.data?.["last-link-up-time"] },
                        { name: "MTU", value: `${iface.data?.mtu} / actual: ${iface.data?.["actual-mtu"]}` },
                    ]}
                />
            </Grid>
        </>
    );
}
