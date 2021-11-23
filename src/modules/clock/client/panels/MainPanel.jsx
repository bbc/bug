import React from "react";
import { makeStyles } from "@mui/styles";
import DigitalClock from "../components/DigitalClock";
import AnalogueClock from "../components/AnalogueClock";
import DateString from "../components/DateString";
import { useSelector } from "react-redux";
import Hidden from "@mui/material/Hidden";

const useStyles = makeStyles(async (theme) => ({
    content: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        minWidth: 200,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
}));

export default function MainPanel() {
    const classes = useStyles();
    const panelConfig = useSelector((state) => state.panelConfig);

    const Clock = (props) => {
        if (panelConfig.data.type === "digital") {
            return <DigitalClock {...props} />;
        }
        return <AnalogueClock {...props} />;
    };

    const renderClock = () => {
        return (
            <>
                <Hidden only={["sm", "md", "lg", "xl"]}>
                    <Clock size="xs" />
                </Hidden>
                <Hidden only={["xs", "md", "lg", "xl"]}>
                    <Clock size="sm" />
                </Hidden>
                <Hidden only={["xs", "sm", "lg", "xl"]}>
                    <Clock size="md" />
                </Hidden>
                <Hidden only={["xs", "sm", "md", "xl"]}>
                    <Clock size="lg" />
                </Hidden>
                <Hidden only={["xs", "sm", "md", "lg"]}>
                    <Clock size="xl" />
                </Hidden>
            </>
        );
    };

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <div className={classes.content}>
            {renderClock()}
            <DateString />
        </div>
    );
}
