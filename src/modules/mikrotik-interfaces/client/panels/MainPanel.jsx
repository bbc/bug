import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InterfaceList from '../components/InterfaceList';

const useStyles = makeStyles((theme) => ({}));

export default function MainPanel(props) {
    const classes = useStyles();

    return (
        <>
            <InterfaceList id={props.id}/>
        </>
    );
}
