import React from "react";
import { makeStyles } from "@mui/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(async (theme) => ({
    card: {
        minWidth: 150,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
}));

export default function StatusCard(props) {
    const classes = useStyles();

    return (
        <Grid item lg={12} sm={12} xs={12}>
            <Card className={classes.card}>
                <CardContent></CardContent>
            </Card>
        </Grid>
    );
}
