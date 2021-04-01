import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InterfaceList from './InterfaceList';

const useStyles = makeStyles((theme) => ({}));

export default function MainPanel(props) {
    const classes = useStyles();

    return (
        <>
            This is the Mikrotik interfaces main panel which uses id {props.id}
            <InterfaceList id={props.id}/>
        </>
    );
}
