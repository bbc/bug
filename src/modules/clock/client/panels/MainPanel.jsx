import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

import DigitalClock from "../components/DigitalClock";
import AnalogueClock from "../components/AnalogueClock";
import DateString from "../components/DateString";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card: {
        minWidth: 200,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
}));

export default function MainPanel() {
    const classes = useStyles();
    const panelConfig = useSelector((state) => state.panelConfig);

    const renderClock = () => {
        let clock = <DigitalClock />;
        if (panelConfig.data.type === "analogue") {
            clock = <AnalogueClock />;
        }
        return clock;
    };

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <React.Fragment>
            <div className={classes.root}>
                <Grid
                    container
                    spacing={4}
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item lg={6} sm={12} xs={12}>
                        <Card className={classes.card}>
                            <CardContent>{renderClock()}</CardContent>
                            <DateString />
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    );
}
