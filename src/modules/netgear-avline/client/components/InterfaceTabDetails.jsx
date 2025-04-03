import BugDetailsTable from "@core/BugDetailsTable";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useApiPoller } from "@hooks/ApiPoller";
import Grid from "@mui/material/Grid";
import React from "react";

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
                        { name: "Interface ID", value: iface.data?.longId },
                        { name: "Port", value: iface.data?.port },
                        { name: "TX Rate", value: iface.data?.["tx-rate-text"] },
                        { name: "RX Rate", value: iface.data?.["rx-rate-text"] },

                        { name: "Auto Negotiation", value: iface.data?.["autoNegotiateActive"] ? "yes" : "no" },
                        { name: "Admin State", value: iface.data?.["adminMode"] ? "up" : "down" },
                        { name: "Link State", value: iface.data?.["linkStatus"] === 1 ? "down" : "up" },
                        { name: "POE Available", value: iface.data?.["isPoE"] ? "yes" : "no" },

                        { name: "Operational Speed", value: iface.data?.["bandwidthText"] },

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
