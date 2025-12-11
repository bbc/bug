import BugDetailsTable from "@core/BugDetailsTable";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useApiPoller } from "@hooks/ApiPoller";
import Grid from "@mui/material/Grid";

export default function InterfaceTabNeighbors({ panelId, interfaceId }) {
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
                        { name: "Remote Port Description", value: iface.data?.lldp?.remotePortDesc },
                        { name: "Remote MAC Address", value: iface.data?.lldp?.remotePortId },
                        { name: "Remote Name", value: iface.data?.lldp?.remoteSysName },
                        { name: "Remote Description", value: iface.data?.lldp?.remoteSysDesc },
                        { name: "MAC Address", value: iface.data?.lldp?.chassisId },
                        { name: "IP Address", value: iface.data?.lldp?.address },
                    ]}
                />
            </Grid>
        </>
    );
}
