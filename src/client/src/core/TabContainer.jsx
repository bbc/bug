import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    tabContainer: {
        width: '100%',
        position: 'absolute',
        backgroundColor: theme.palette.appbar.default
    },
    tabSpacer: {
        height: 56,
        position: 'relative',
        zIndex: -1
    }
}));

export default function TabContainer(props) {
    const classes = useStyles();

    return (
        <>
            <div className={classes.tabContainer}>
                {props.children}
            </div>
            <div className={classes.tabSpacer}>

            </div>
        </>
    );
}
