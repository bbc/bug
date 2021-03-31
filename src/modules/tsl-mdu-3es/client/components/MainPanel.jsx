import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function MainPanel(props) {
    const classes = useStyles();

    return (
        <>
            This is the TSL Mains Distribution Unit main panel which uses id {props.id}
        </>
    );
}
