import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Interface from '../components/Interface';
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({}));

export default function InterfacePanel(props) {
    const classes = useStyles();
    const params = useParams();

    return (
        <>
            <Interface {...props} interfaceid={params.interfaceid ?? ""}/>
        </>
    );
}
