import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import DigitalClock from '../components/DigitalClock';
import AnalogueClock from '../components/AnalogueClock';
import DateString from '../components/DateString';

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

export default function MainPanel({ config }) {
  const classes = useStyles();

  const renderClock = () => {
    let clock = (<DigitalClock />);
    if (config?.type === 'analogue') {
      clock = (<AnalogueClock />);
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
                {renderClock()}
              </CardContent>
              <DateString />
            </Card>

          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}
