import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import DigitalClock from './DigitalClock';
import AnalogueClock from './AnalogueClock';
import Date from './Date';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    minWidth: 200,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
}));

export default function MainPanel(props) {
  const classes = useStyles();

  const renderClock = () => {
    let clock =  (<DigitalClock/>);
    if( props?.config?.type === 'analogue' ){
      clock = (<AnalogueClock/>);
    }
    return clock
  }

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid 
          container spacing={4} 
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item lg={6} sm={12} xs={12} >
            
              <Card className={classes.card} >
                <CardContent>
                   { renderClock() }
                </CardContent>
                <Date/>
              </Card>
  
          </Grid>
        </Grid>
      </div>
    </React.Fragment> 
  );
}
