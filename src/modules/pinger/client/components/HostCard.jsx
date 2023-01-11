import React from "react";
import { useHistory } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AxiosGet from "@utils/AxiosGet";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { formatDistanceToNow } from "date-fns";
import { useLongPress } from "use-long-press";
import { useAlert } from "@utils/Snackbar";

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
    const history = useHistory();
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
        history.push(`/panel/${panelId}/host/${hostId}`);
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
                                    <Grid width={"50%"} key={1} item xs={0}>
                                        <Typography variant="h4" component="div">
                                            {title}
                                        </Typography>
                                        <Typography variant="body2">{description}</Typography>
                                    </Grid>

                                    <Grid width={"50%"} alignItems="flex-end" justify="flex-end" key={0} item xs={0}>
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
