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

    const getSparklines = () => {
        if (props.history_stats) {
            return (
                <>
                    <Sparklines
                        data={props.history_stats.map(
                            (stats) => stats?.decoder_vdec_framerate
                        )}
                        min={0}
                        max={100}
                    >
                        <SparklinesLine color="#337ab7" />
                    </Sparklines>
                    {`${
                        Math.round(
                            props.history_stats[props.history_status.length - 1]
                                ?.decoder_vdec_framerate * 100
                        ) / 100
                    }fps`}
                </>
            );
        }
        return null;
    };
    return (
        <Grid key={props?.sid} item lg={4} md={6} sm={12} xs={12}>
            <Card className={classes.card}>
                <CardHeader
                    title={props?.name}
                    titleTypographyProps={{ variant: "h6" }}
                    subheader={props.status.toUpperCase()}
                />
                <CardContent>
                    {getSparklines()}
                    {props.model}
                </CardContent>
            </Card>
        </Grid>
    );
}
