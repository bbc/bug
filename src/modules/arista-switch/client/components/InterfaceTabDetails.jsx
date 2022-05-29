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
                        { name: "Description", value: iface.data?.description },
                        { name: "Alias", value: iface.data?.alias },
                        { name: "Interface ID", value: iface.data?.longId },
                        { name: "TX Rate", value: iface.data?.["tx-rate-text"] },
                        { name: "RX Rate", value: iface.data?.["rx-rate-text"] },

                        { name: "Auto Negotiation", value: iface.data?.["admin-state"] ? "yes" : "no" },
                        { name: "Admin State", value: iface.data?.["admin-state"] ? "up" : "down" },
                        { name: "Link State", value: iface.data?.["link-state"] ? "up" : "down" },

                        { name: "Admin Speed", value: iface.data?.["admin-speed"] },
                        { name: "Operational Speed", value: iface.data?.["operational-speed"] },

                        { name: "Untagged VLAN", value: iface.data?.["untagged-vlan"] },
                        {
                            name: "Tagged VLANs",
                            value: iface.data?.["tagged-vlans"] ? iface.data?.["tagged-vlans"].join(", ") : "",
                        },
                    ]}
                />
            </Grid>
        </>
    );
}
