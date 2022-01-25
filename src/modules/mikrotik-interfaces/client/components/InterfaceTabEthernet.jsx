import React from "react";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";
import Loading from "@components/Loading";
import BugDetailsTable from "@core/BugDetailsTable";

export default function InterfaceTabEthernet({ panelId, interfaceName }) {
    const iface = useApiPoller({
        url: `/container/${panelId}/interface/${interfaceName}`,
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
                        { name: "Status", value: iface.data?.linkstats?.status },
                        { name: "Auto Negotiation", value: iface.data?.linkstats?.["auto-negotiation"] },
                        { name: "Negotiated Rate", value: iface.data?.linkstats?.rate },
                        { name: "Full Duplex?", value: iface.data?.linkstats?.["full-duplex"] ? "yes" : "no" },
                        { name: "TX Flow Control?", value: iface.data?.linkstats?.["tx-flow-control"] ? "yes" : "no" },
                        { name: "RX Flow Control?", value: iface.data?.linkstats?.["rx-flow-control"] ? "yes" : "no" },
                        {
                            name: "Advertised Rates",
                            value: iface.data?.linkstats?.advertising
                                ? iface.data.linkstats.advertising.join(", ")
                                : "",
                        },
                        {
                            name: "Link Partner Rates",
                            value: iface.data?.linkstats?.["link-partner-advertising"]
                                ? iface.data.linkstats["link-partner-advertising"].join(", ")
                                : "",
                        },
                    ]}
                />
            </Grid>
        </>
    );
}
