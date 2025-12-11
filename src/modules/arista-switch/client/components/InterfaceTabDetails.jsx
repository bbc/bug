import BugDetailsTable from "@core/BugDetailsTable";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useApiPoller } from "@hooks/ApiPoller";
import Grid from "@mui/material/Grid";

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
            <Grid item size={{ xs: 12 }}>
                <BugDetailsTable
                    items={[
                        { name: "Interface ID", value: iface.data?.longId },
                        { name: "Description", value: iface.data?.description },
                        { name: "TX Rate", value: iface.data?.["tx-rate-text"] },
                        { name: "RX Rate", value: iface.data?.["rx-rate-text"] },

                        { name: "Auto Negotiation", value: iface.data?.["autoNegotiateActive"] ? "yes" : "no" },
                        { name: "Link Status", value: iface.data?.linkStatus },
                        { name: "Interface Type", value: iface.data?.interfaceType },
                        { name: "Port Bandwidth", value: iface.data?.["bandwidthText"] },

                        { name: "Untagged VLAN", value: iface.data?.["accessVlanId"] },
                        {
                            name: "Tagged VLANs",
                            value: iface.data?.["trunkAllowedVlans"],
                        },
                        {
                            name: "Native VLAN",
                            value: iface.data?.["trunkingNativeVlanId"],
                        },
                    ]}
                />
            </Grid>
        </>
    );
}
