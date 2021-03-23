import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function MainPanel(props) {
    const classes = useStyles();

    return (
        <>
            This is the Mikrotik interfaces main panel which uses id {props.id}
        </>
    );
}
