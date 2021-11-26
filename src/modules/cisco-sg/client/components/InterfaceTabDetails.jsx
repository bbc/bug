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
                        { name: "Tagged VLANs", value: iface.data?.["tagged-vlans"].join(", ") },
                    ]}
                />
            </Grid>
        </>
    );
}
