import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import Weather from './Weather';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  }
}));

export default function MainPanel(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid 
          container spacing={4} 
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item lg={12} sm={12} xs={12} >
            <Weather/>
          </Grid>
        </Grid>
      </div>
    </React.Fragment> 
  );
}
