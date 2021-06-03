import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { Sparklines, SparklinesLine } from "react-sparklines";

const useStyles = makeStyles((theme) => ({
    card: {
        minWidth: 150,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
}));

export default function EncoderCard(props) {
    const classes = useStyles();

    const [decoderStats, setDecoderStats] = useState([]);

    props.socket.emit("room:enter", `device:${props.sid}:decoder-stats`);
    props.socket.emit("room:enter", `device:${props.sid}:decoder-status`);
    props.socket.emit("room:enter", `device:${props.sid}:decoder-status`);

    props.socket.on(`device:${props.sid}:decoder-stats`, (data) => {
        const newStats = decoderStats;
        if (newStats.length >= 20) {
            newStats.shift();
            newStats.push(data);
        }
        newStats.push(data);
        setDecoderStats(newStats);
    });

    return (
        <Grid key={props?.sid} item lg={4} md={6} sm={12} xs={12}>
            <Card className={classes.card}>
                <CardHeader
                    title={props?.name}
                    titleTypographyProps={{ variant: "h6" }}
                    subheader={props.status.toUpperCase()}
                />
                <CardContent>
                    <Sparklines
                        data={decoderStats.map(
                            (stats) => stats?.decoder_vdec_framerate
                        )}
                        min={0}
                        max={100}
                    >
                        <SparklinesLine color="#337ab7" />
                    </Sparklines>
                    {`${
                        Math.round(
                            decoderStats[decoderStats.length - 1]
                                ?.decoder_vdec_framerate * 100
                        ) / 100
                    }fps`}
                    {props.model}
                </CardContent>
            </Card>
        </Grid>
    );
}
