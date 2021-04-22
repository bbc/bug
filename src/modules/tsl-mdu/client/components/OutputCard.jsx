import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    card: {
      minWidth: 150,
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }
  }));

export default function OutputCard(props) {
    const classes = useStyles();

    return (
        <Grid item lg={3} sm={6} xs={12} >
      
            <Card className={classes.card} >
                <CardHeader
                    title={ props?.name } 
                />
                <CardContent>
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button>On</Button>
                        <Button>Off</Button>
                    </ButtonGroup>
                </CardContent>
            </Card>

        </Grid>
    );
}
