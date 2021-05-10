import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

import axios from 'axios';
import Grid from "@material-ui/core/Grid";
import PanelContext from "@core/PanelContext";

import OutputCard from "../components/OutputCard";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

export default function MainPanel() {
    const config = useContext(PanelContext);

    const classes = useStyles();
    const [outputs, setOutputs] = useState([]);
    const [status, setStatus] = useState(null);

    const getStatus = async () => {
        const response = await axios.get(`/container/${config?.id}/status`);
        setStatus(response?.data?.mdu?.status);
        setOutputs(response?.data?.mdu?.outputs);
    };

    useEffect(() => {
        getStatus();
        const interval = setInterval(getStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    const renderOutputs = () => {
        const ouputCards = [];
        for (let output of outputs) {
            ouputCards.push(<OutputCard key={config.number} {...output} config={config} />);
        }
        return ouputCards;
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={1} justify="center" alignItems="center">
                {renderOutputs()}
            </Grid>
        </div>
    );
}
