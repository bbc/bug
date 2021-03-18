import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function MainPanel(props) {
    const classes = useStyles();

    return (
        <>
            This is the ciscoSG main panel which uses id {props.id}
        </>
    );
}
