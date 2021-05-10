import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const useStyles = makeStyles((theme) => ({
    card: {
        minWidth: 150,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    outputOff:{
        color: red
    },
    outputOn:{
        color: green
    },
}));

export default function OutputCard(props) {
    const classes = useStyles();

    const handleClick = async (event) => {

        const newState = !!+!props.state;
        let verb = 'off';

        if(newState){
            verb = 'on'
        }

        const response = await axios.post(`/container/${props?.config?.id}/output/${props.number}/state`,{
            state: !!+!props.state,
            action: `${props.config.title}: Turning ${verb} of ${props?.name}`
        });

        console.log(response.data)
    };

    const getColor = () => {
        if(props.state){
            return classes.outputOn;
        }
        return classes.outputOff;
    
    }

    return (
        <Grid item lg={3} sm={6} xs={12} >

            <Card className={classes.card} >
                <CardHeader
                    title={props?.name}
                />
                <CardContent>
                    <ButtonGroup onClick={handleClick} disableElevation variant="outlined" className={getColor()}>
                        <Button disabled={!!+!props.state}>On</Button>
                        <Button disabled={!!+props.state}>Off</Button>
                    </ButtonGroup>
                </CardContent>
            </Card>

        </Grid>
    );
}
