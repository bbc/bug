import React from "react";
import { useHistory, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function HostCard({ title, description, alive, host, hostId, data }) {
    const params = useParams();
    const history = useHistory();
    const label = "avg";
    let cardColor = "success";

    if (!alive) {
        cardColor = "error";
    } else if (data[0].avg > 60) {
        cardColor = "warning";
    }

    const handleClick = (event) => {
        history.push(`/panel/${params.panelId}/host/${index}`);
    };

    const getPingText = (time, alive) => {
        let text = "";
        console.log();
        if (alive || time !== "unknown") {
            text = `${parseInt(time)}ms`;
        }
        return text;
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
                sx={{
                    borderRadius: "3px",
                    minWidth: 275,
                    margin: "4px",
                    backgroundColor: `${cardColor}.main`,
                    "&:hover": {
                        background: `${cardColor}.hover`,
                    },
                }}
                variant="outlined"
            >
                <CardActionArea sx={{ padding: 0 }}>
                    <CardContent sx={{ padding: 0 }}>
                        <div style={{ margin: "auto", position: "relative" }}>
                            <Sparklines data={formatStats(data)} style={{ opacity: 0.7 }} min={0}>
                                <SparklinesLine color="#333333" />
                            </Sparklines>
                            <div
                                style={{
                                    padding: "1em",
                                    top: 0,
                                    left: 0,
                                    position: "absolute",
                                }}
                            >
                                <Grid container>
                                    <Grid key={1} item xs={0}>
                                        <Typography variant="h5" component="div">
                                            {title}
                                        </Typography>
                                        <Typography variant="body2">{description}</Typography>
                                    </Grid>

                                    <Grid sx={{ textAlign: "right" }} key={0} item xs={0}>
                                        <Typography sx={{ textAlign: "right" }} variant="h4" component="div">
                                            {getPingText(data[data.length - 1].avg, alive)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
}