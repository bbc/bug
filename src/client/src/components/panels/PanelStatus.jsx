import React from "react";
import { makeStyles } from "@mui/styles";
import BugAlert from "@components/BugAlert";

const useStyles = makeStyles((theme) => ({
    panelStatus: {},
}));

export default function PanelStatus({ statusItems, panel }) {
    const classes = useStyles();
    return (
        <div className={classes.panelStatus}>
            {statusItems.map((eachItem) => (
                <BugAlert
                    key={eachItem.key}
                    type={eachItem.type}
                    message={eachItem.message}
                    flags={eachItem.flags}
                    panel={panel}
                    square
                />
            ))}
        </div>
    );
}
