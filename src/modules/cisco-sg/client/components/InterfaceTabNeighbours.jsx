import React from "react";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@utils/ApiPoller";
import Loading from "@components/Loading";
import BugDetailsTable from "@core/BugDetailsTable";

export default function InterfaceTabDetails({ panelId, interfaceId }) {
    const iface = useApiPoller({
        url: `/container/${panelId}/interface/${interfaceId}`,
        interval: 5000,
    });

    if (iface.status === "idle" || iface.status === "loading") {
        return <Loading height="30vh" />;
    }
    if (iface.status === "success" && !iface.data) {
        return <>Interface not found</>;
    }

    return (
        <>
            <Grid item xs={12}>
                <BugDetailsTable
                    data={[
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
