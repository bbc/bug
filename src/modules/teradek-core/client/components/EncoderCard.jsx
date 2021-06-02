import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

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

    console.log(props);
    return (
        <Grid item lg={4} md={6} sm={12} xs={12}>
            <Card className={classes.card}>
                <CardHeader
                    title={props?.name}
                    titleTypographyProps={{ variant: "h6" }}
                    subheader={props.status.toUpperCase()}
                />

                <CardContent></CardContent>
            </Card>
        </Grid>
    );
}
