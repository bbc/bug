import React from "react";
import Grid from "@mui/material/Grid";
import BugCard from "@core/BugCard";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { useApiPoller } from "@hooks/ApiPoller";

export default function SpeedCard({
    running = true,
    url,
    units = "Mb/s",
    title = "Download",
    interval = 1000,
    label = "speed",
}) {
    const stats = useApiPoller({
        polling: running,
        url: url,
        interval: interval,
    });

    const formatStats = (stats) => {
        if (stats) {
            // pull values from array of objects

            let formattedStats = stats.map((a) => a[label]);

            // replace all undefined values with 0
            formattedStats = formattedStats.map((v) => {
                if (isNaN(v)) {
                    return 0;
                }
                if (v === undefined) {
                    return 0;
                }
                return v;
            });

            return formattedStats;
        }
        return [];
    };

    const getValue = (stats = []) => {
        if (stats) {
            if (stats.length > 0) {
                return `${Math.round(stats[stats.length - 1][label] * 10) / 10}${units}`;
            }
        }
        return "";
    };

    return (
        <>
            <Grid item md={6} xs={12}>
                <BugCard minHeight={240}>
                    <CardHeader title={title} />

                    <CardContent>
                        <div style={{ position: "relative" }}>
                            <Sparklines data={formatStats(stats.data)} style={{ opacity: 0.7 }} min={0}>
                                <SparklinesLine color="#337ab7" />
                            </Sparklines>
                            <div
                                style={{
                                    position: "absolute",
                                    top: 8,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                }}
                            >
                                <Typography variant="h2" noWrap>
                                    {getValue(stats.data)}
                                </Typography>{" "}
                            </div>
                        </div>
                    </CardContent>
                </BugCard>
            </Grid>
        </>
    );
}
