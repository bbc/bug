import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import AxiosGet from "@utils/AxiosGet";
import Grid from '@material-ui/core/Grid';
import OutputCard from '../components/OutputCard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  }
}));

export default function MainPanel({ config }) {

  const classes = useStyles();
  const [outputs, setOutputs] = useState([]);
  const [status, setStatus] = useState(null);

  const getStatus = async () => {
    const response = await AxiosGet(`/container/${config?.id}/status`);
    setStatus(response?.mdu?.status);
    setOutputs(response?.mdu?.outputs);
  }

  useEffect(() => {
    getStatus();
    const interval = setInterval(getStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderOutputs = () => {
    const ouputs = [];
    for (let output of outputs) {
      ouputs.push(<OutputCard {...output} />);
    }
    return outputs
  }

  return (
    <div className={classes.root}>
      <Grid
        container spacing={4}
        direction="column"
        justify="center"
        alignItems="center"
      >
        {renderOutputs()}
      </Grid>
    </div>
  );
}
