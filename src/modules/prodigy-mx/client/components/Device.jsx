import React from "react";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import BugDetailsCard from "@core/BugDetailsCard";
import BugNoData from "@core/BugNoData";

export default function Device({ panelId }) {
    const device = useApiPoller({
        url: `/container/${panelId}/device`,
        interval: 5000,
    });

    const health = useApiPoller({
        url: `/container/${panelId}/health`,
        interval: 5000,
    });

    if (
        device.status === "idle" ||
        device.status === "loading" ||
        health.status === "idle" ||
        health.status === "loading"
    ) {
        return <BugLoading height="30vh" />;
    }
    if (device.status === "success" && !device.data) {
        return <BugNoData title="Device information not found" showConfigButton={false} />;
    }

    if (health.status === "success" && !health.data) {
        return <BugNoData title="Health information not found" showConfigButton={false} />;
    }

    return (
        <Grid container spacing={0.5} sx={{ backgroundColor: "background.default", height: "100%" }}>
            <Grid item xs={12} md={6}>
                <BugDetailsCard
                    width="18rem"
                    title={`Device Information`}
                    items={[
                        { name: "Model", value: device.data.model },
                        { name: "Name", value: device.data.name },
                        { name: "Front panel auto lock", value: device.data.front_panel_auto_lock ? "YES" : "NO" },
                        { name: "Front panel lock", value: device.data.front_panel_lock ? "YES" : "NO" },
                        { name: "Front panel lock timeout", value: `${device.data.front_panel_lock_timeout} seconds` },
                        { name: "Front panel PIN set", value: device.data.front_panel_pin_set ? "YES" : "NO" },
                    ]}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <BugDetailsCard
                    width="18rem"
                    title={`Device Health`}
                    items={[
                        { name: "CPU Temperature", value: `${health.data.cpu_temp} °C` },
                        { name: "Power", value: `${health.data.power} V` },
                        { name: "Temperature 1", value: `${health.data.temp1} °C` },
                        { name: "Temperature 2", value: `${health.data.temp2} °C` },
                        { name: "Temperature Local", value: `${health.data.temp_local} °C` },
                    ]}
                />
            </Grid>
        </Grid>
    );
}
