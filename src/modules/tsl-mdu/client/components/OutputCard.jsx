import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    card: {
        minWidth: 100,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    outputOn: {
        color: theme.palette.success.main,
    },
    outputOff: {
        color: theme.palette.error.main,
    },
    outputError: {
        color: theme.palette.warning.main,
    },
}));

export default function OutputCard(props) {
    const classes = useStyles();
    const [output, setOutput] = useState(props.output);

    useEffect(() => {
        setOutput(props.output);
    }, [props.output]);

    const handleClick = async (event) => {
        const newState = !!+!output.state;
        let verb = "off";

        if (newState) {
            verb = "on";
        }

        const response = await axios.post(
            `/container/${props?.config?.id}/output/${output.number}/state`,
            {
                state: !!+!output.state,
                action: `${props.config.title}: Turning ${verb} ${output?.name}`,
            }
        );

        setOutput(response?.data?.output);
    };

    const getColor = () => {
        if (output.fuse === "failed") {
            return classes.outputError;
        }
        if (output.state) {
            return classes.outputOn;
        }
        return classes.outputOff;
    };

    return (
        <Grid item lg={3} sm={3} xs={12}>
            <Card className={classes.card}>
                <CardHeader
                    title={output?.name}
                    titleTypographyProps={{ variant: "h6" }}
                    subheader={output?.state ? output?.fuse : ""}
                />
                <CardContent>
                    <ButtonGroup
                        onClick={handleClick}
                        disableElevation
                        variant="outlined"
                        color="inherit"
                        className={getColor()}
                    >
                        <Button disabled={output.state}>On</Button>
                        <Button disabled={!output.state}>Off</Button>
                    </ButtonGroup>
                </CardContent>
            </Card>
        </Grid>
    );
}
