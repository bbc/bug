import BugCard from "@core/BugCard";
import { useApiPoller } from "@hooks/ApiPoller";
import { Box, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function SpeedCard({
    forceRefresh,
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
        forceRefresh: forceRefresh,
    });
    const theme = useTheme();
    const isLGView = useMediaQuery(theme.breakpoints.up("lg"));

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
                return `${Math.round((stats[stats.length - 1][label] / 100000) * 10) / 10}${units}`;
            }
        }
        return "";
    };

    const formattedStats = formatStats(stats.data);
    return (
        <>
            <Grid size={{ md: 6, xs: 12 }} sx={{ padding: "8px" }}>
                <BugCard>
                    <CardHeader title={title} />

                    <CardContent
                        sx={{
                            padding: 1,
                            "&.MuiCardContent-root:last-child": {
                                paddingBottom: 0,
                            },
                        }}
                    >
                        {stats?.data?.length > 0 ? (
                            <div style={{ position: "relative" }}>
                                <Sparklines data={formattedStats} style={{ opacity: 0.7 }} min={0}>
                                    <SparklinesLine color="#337ab7" />
                                </Sparklines>
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            lineHeight: 1,
                                            fontSize: isLGView ? "3.75rem" : "2.5rem",
                                        }}
                                        noWrap
                                    >
                                        {getValue(stats.data)}
                                    </Typography>
                                </div>
                            </div>
                        ) : (
                            <Box display="flex" alignItems="center" justifyContent="center" height={100}>
                                Waiting for data...
                            </Box>
                        )}
                    </CardContent>
                </BugCard>
            </Grid>
        </>
    );
}
