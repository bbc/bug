import { Box, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import { useAlert } from "@utils/Snackbar";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { useLongPress } from "use-long-press";

export default function HostCard({
    panelId,
    title,
    time,
    description,
    acknowledged,
    alive,
    hostId,
    lastPinged,
    data = [],
}) {
    const navigate = useNavigate();
    const sendAlert = useAlert();
    const label = "avg";
    let cardColor = "success";

    const bind = useLongPress(async (event) => {
        if (!alive) {
            const response = await AxiosGet(`/container/${panelId}/hosts/${hostId}/acknowledge`);
            if (response && response.acknowledged) {
                sendAlert(`Acknowledged ${title}`, { variant: "info" });
            } else if (response && !response.acknowledged) {
                sendAlert(`Unacknowledged ${title}`, { variant: "info" });
            } else {
                sendAlert(`Could not acknowledge ${title}`, { variant: "error" });
            }
        }
    });

    if (data.length === 0 || acknowledged) {
        cardColor = "primary";
    } else if (!alive) {
        cardColor = "error";
    } else if (data[data.length - 1]?.packetLoss > 0) {
        cardColor = "warning";
    }

    const handleClick = (event) => {
        navigate(`/panel/${panelId}/host/${hostId}`);
    };

    const getPingText = (time, alive) => {
        if (!time && !lastPinged) {
            return "waiting";
        }
        if (alive || time !== "unknown") {
            return `${parseInt(time)}ms`;
        }
        return "failed";
    };

    const getTime = (lastPinged) => {
        if (lastPinged) {
            return `last seen ${formatDistanceToNow(new Date(lastPinged), {
                includeSeconds: true,
                addSuffix: true,
            })}`;
        }
    };

    const formatStats = (data) => {
        if (data) {
            // pull values from array of objects

            let formattedStats = data.map((a) => a[label]);

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

    return (
        <>
            <Card
                onClick={handleClick}
                {...bind()}
                sx={{
                    borderRadius: "3px",
                    minWidth: 275,
                    height: "100%",
                    backgroundColor: `${cardColor}.secondary`,
                    "&:hover": {
                        background: `${cardColor}.hover`,
                    },
                }}
                variant="outlined"
            >
                <CardActionArea sx={{ padding: 0 }}>
                    <CardContent sx={{ width: "100%", padding: "0.2em" }}>
                        <div style={{ margin: "auto", position: "relative" }}>
                            <Box sx={{ m: 1 }}>
                                <Grid container>
                                    <Grid width={"50%"} key={1} size={{ xs: 0 }}>
                                        <Typography variant="h4" component="div">
                                            {title}
                                        </Typography>
                                        <Typography variant="body2">{description}</Typography>
                                    </Grid>

                                    <Grid
                                        width={"50%"}
                                        alignItems="flex-end"
                                        justify="flex-end"
                                        key={0}
                                        size={{ xs: 0 }}
                                    >
                                        <Typography sx={{ textAlign: "right" }} variant="h4" component="div">
                                            {getPingText(time, alive)}
                                        </Typography>
                                        <Typography sx={{ textAlign: "right" }} variant="body2">
                                            {getTime(lastPinged)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <div
                                style={{
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                }}
                            >
                                <Sparklines data={formatStats(data)} limit={50} style={{ opacity: 0.7 }} min={0}>
                                    <SparklinesLine style={{ fill: "none" }} color="background.hover" />
                                </Sparklines>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
}
