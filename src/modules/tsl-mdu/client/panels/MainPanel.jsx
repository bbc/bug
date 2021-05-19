import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import OutputCard from "../components/OutputCard";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

export default function MainPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const classes = useStyles();
    const [outputs, setOutputs] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        getStatus();
        const interval = setInterval(getStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const getStatus = async () => {
        const response = await axios.get(`/container/${panelConfig.data.id}/status`);
        setStatus(response?.data?.mdu?.status);
        setOutputs(response?.data?.mdu?.outputs);
    };

    const renderOutputs = () => {
        const ouputCards = [];
        for (let output of outputs) {
            ouputCards.push(<OutputCard key={config.number} {...output} config={panelConfig.data} />);
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
