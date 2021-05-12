import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PanelConfigContext from '@core/PanelConfigContext';
import Grid from '@material-ui/core/Grid';

import Weather from '../components/Weather';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  }
}));

export default function MainPanel() {

  const config = useContext(PanelConfigContext);
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <Grid
          container spacing={4}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item lg={12} sm={12} xs={12} >
            <Weather {...config} />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
