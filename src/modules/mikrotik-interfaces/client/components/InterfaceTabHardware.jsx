import React from "react";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";
import Loading from "@components/Loading";
import BugDetailsTable from "@core/BugDetailsTable";
import BugNoData from "@core/BugNoData";

export default function InterfaceTabHardware({ panelId, interfaceName }) {
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
                        {
                            name: "SFP Module Present",
                            value: iface?.data?.linkstats?.["sfp-module-present"] ? "yes" : "no",
                        },
                        { name: "SFP RX Loss", value: iface?.data?.linkstats?.["sfp-rx-loss"] ? "yes" : "no" },
                        { name: "SFP TX Fault", value: iface?.data?.linkstats?.["sfp-tx-fault"] ? "yes" : "no" },
                        { name: "SFP Type", value: iface?.data?.linkstats?.["sfp-type"] },
                        { name: "SFP Connector Type", value: iface?.data?.linkstats?.["sfp-connector-type"] },
                        { name: "SFP Link Length (Copper)", value: iface?.data?.linkstats?.["sfp-link-length-copper"] },
                        { name: "SFP Vendor Name", value: iface?.data?.linkstats?.["sfp-vendor-name"] },
                        { name: "SFP Vendor Part Number", value: iface?.data?.linkstats?.["sfp-vendor-part-number"] },
                        { name: "SFP Vendor Revision", value: iface?.data?.linkstats?.["sfp-vendor-revision"] },
                        { name: "SFP Vendor Serial", value: iface?.data?.linkstats?.["sfp-vendor-serial"] },
                        { name: "SFP Manufacturing Date", value: iface?.data?.linkstats?.["sfp-manufacturing-date"] },
                        { name: "EEPROM checksum", value: iface?.data?.linkstats?.["eeprom-checksum"] },
                    ]}
                />
            </Grid>
        </>
    );
}
