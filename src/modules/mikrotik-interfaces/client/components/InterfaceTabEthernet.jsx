import BugDetailsTable from "@core/BugDetailsTable";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useApiPoller } from "@hooks/ApiPoller";
import Grid from "@mui/material/Grid";

export default function InterfaceTabEthernet({ panelId, interfaceName }) {
    const iface = useApiPoller({
        url: `/container/${panelId}/interface/${interfaceName}`,
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
            <Grid item size={{ xs: 12 }}>
                <BugDetailsTable
                    items={[
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
