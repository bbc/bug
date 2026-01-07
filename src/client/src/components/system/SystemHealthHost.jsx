import BugDetailsTable from "@core/BugDetailsTable";
import BugGauge from "@core/BugGauge";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { Grid } from "@mui/material";
import TimeAgo from "javascript-time-ago";

export default function SystemHealthHost({ stats }) {
    const timeAgo = new TimeAgo("en-GB");

    const oneGigabyte = 1024 * 1024 * 1024;

    const health = useApiPoller({
        url: `/api/system/hosthealth`,
        interval: 2000,
    });

    if (health.status === "loading" || health.status === "idle") {
        return <BugLoading />;
    }

    const upTime = health.data.uptime
        ? timeAgo
              .format(Date.now() - parseInt(health.data.uptime) * 1000)
              .replace("ago", "")
              .trim()
        : "";

    return (
        <>
            <Grid
                container
                spacing={1}
                sx={{
                    backgroundColor: "background.default",
                }}
            >
                <Grid size={{ md: 8, sm: 7, xs: 12 }} sx={{ backgroundColor: "background.paper" }}>
                    <BugDetailsTable
                        width="auto"
                        items={[
                            {
                                name: "Uptime",
                                value: upTime,
                            },
                            {
                                name: "CPU",
                                value: `${health.data.cpu.manufacturer} ${health.data.cpu.brand}`,
                            },
                            { name: "Memory used", value: health.data.memory.used_text },
                            { name: "Memory free", value: health.data.memory.free_text },
                            { name: "Memory total", value: health.data.memory.total_text },
                            { name: "Disk used - images", value: health.data.disk.images_text },
                            { name: "Disk used - containers", value: health.data.disk.containers_text },
                            { name: "Disk used - volumes", value: health.data.disk.volumes_text },
                            { name: "Disk used - buildcache", value: health.data.disk.buildCache_text },
                            { name: "Disk used - total", value: health.data.disk.total_text },
                        ]}
                    />
                </Grid>
                <Grid size={{ md: 4, sm: 5, xs: 12 }}>
                    <BugGauge
                        max={health.data.memory.total / oneGigabyte}
                        value={health.data.memory.used / oneGigabyte}
                        unit="GB"
                        title="Memory Used"
                    />
                </Grid>
            </Grid>
        </>
    );
}
