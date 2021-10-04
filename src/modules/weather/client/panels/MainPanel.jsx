import React from "react";
import { makeStyles } from "@mui/styles";
import Weather from "../components/Weather";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

export default function MainPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);
    const classes = useStyles();

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <>
            <div className={classes.root}>
                <Weather {...panelConfig?.data} />
            </div>
        </>
    );
}
