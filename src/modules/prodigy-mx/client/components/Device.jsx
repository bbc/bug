import BugDetailsCard from "@core/BugDetailsCard";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useApiPoller } from "@hooks/ApiPoller";
import { Grid } from "@mui/material";

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

    const psuStates = ["Not active", "OK", "In an error state", "Not stable"];

    let healthItems = [
        { name: "CPU Temperature", value: `${health.data.cpu_temp} °C` },
        { name: "Power", value: `${health.data.power} W` },
        { name: "Current", value: `${health.data.imain} A` },
        { name: "Temperature 1", value: `${health.data.temp1} °C` },
        { name: "Temperature 2", value: `${health.data.temp2} °C` },
        { name: "Fan 1 speed", value: `${health.data.tach1_rpm} RPM` },
        { name: "Fan 2 speed", value: `${health.data.tach2_rpm} RPM` },
    ];

    healthItems = healthItems.concat(
        health.data.psu.map((eachPsu, index) => {
            return { name: `Power Supply ${index + 1}`, value: psuStates[eachPsu] };
        })
    );

    return (
        <Grid
            container
            spacing={0.5}
            sx={{ backgroundColor: "background.default", height: "100%", alignContent: "start" }}
        >
            <Grid size={{ sm: 12, md: 6 }}>
                <BugDetailsCard
                    sx={{ marginBottom: 0 }}
                    width="14rem"
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
            <Grid size={{ sm: 12, md: 6 }}>
                <BugDetailsCard width="14rem" title={`Device Health`} items={healthItems} />
            </Grid>
        </Grid>
    );
}
