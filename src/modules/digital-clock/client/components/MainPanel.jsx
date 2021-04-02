import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    minWidth: 200,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
}));

export default function MainPanel(props) {
    const classes = useStyles();
    const [data, setData] = useState({time:'hh:mm:ss', date:'dd/mm/yyyy'});
    
    const days = ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    useEffect(() => {
        getTime();
        setInterval(getTime,500);
    },[]);

    const pad = (n, width, z) => {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }

    const getTime = () => {
        const now = new Date()

        const hours = pad(now.getHours(),2);
        const minutes = pad(now.getMinutes(),2);
        const seconds = pad(now.getSeconds(),2);

        const day = days[now.getDay()];
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const date = now.getDate()
 
        setData({
            time: (hours + ":" + minutes + ":" + seconds),
            date: (day + ', ' + month + ' ' + date + ', ' + year)
        });
    }

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={4} justify="center" >
            <Grid item lg={12} sm={12} xs={12} >
              
                <Card className={classes.card} >
                  <CardContent>
  
                    <Typography variant="h1" component="p">
                      { data.time }
                    </Typography>
                    <Typography variant="h5" component="p">
                      { data.date }
                    </Typography>
  
                  </CardContent>
                </Card>
   
            </Grid>
          </Grid>
        </div>
      </React.Fragment> 
    );
}
