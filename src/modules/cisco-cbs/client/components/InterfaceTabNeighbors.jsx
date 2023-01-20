import React from "react";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import BugDetailsTable from "@core/BugDetailsTable";
import BugNoData from "@core/BugNoData";

export default function InterfaceTabDetails({ panelId, interfaceId }) {
    const iface = useApiPoller({
        url: `/container/${panelId}/interface/${interfaceId}`,
        interval: 5000,
    });

    if (iface.status === "idle" || iface.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (iface.status === "success" && !iface.data) {
        return <BugNoData title="Interface not found" showConfigButton={false} />;
    }

    return (
        <>
            <Grid item xs={12}>
                <BugDetailsTable
                    items={[
                        { name: "Name", value: iface.data?.lldp?.system_name },
                        { name: "Description", value: iface.data?.lldp?.system_description },
                        { name: "Remote Port", value: iface.data?.lldp?.port_description },
                        { name: "Local Port", value: iface.data?.lldp?.port_id },
                        { name: "Remote MAC Address", value: iface.data?.lldp?.chassis_id },
                    ]}
                />
            </Grid>
        </>
    );
}
