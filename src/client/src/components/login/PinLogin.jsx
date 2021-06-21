import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useAlert } from "@utils/Snackbar";
import LoadingOverlay from "@components/LoadingOverlay";
import AxiosPost from "@utils/AxiosPost";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import BackspaceIcon from "@material-ui/icons/Backspace";

const useStyles = makeStyles((theme) => ({
    number: {
        margin: theme.spacing(2),
    },
    form: {
        margin: theme.spacing(2),
        textAlign: "center",
    },
}));

export default function PinLogin() {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [pin, setPin] = useState("");

    const handleDelete = async () => {
        setPin(pin.slice(0, -1));
    };

    const handlePress = async (number) => {
        setPin(pin.concat(number));
        handleChange({ target: { value: pin.concat(number) } });
    };

    const handleChange = async (event) => {
        console.log(event);
        setPin(event.target.value);
        if (isNaN(event.target.value)) {
            setError("Pin code must be a number");
            return;
        }

        if (event.target.value.length > 4) {
            setError("Pin code must be exactly 4 digits long.");
            return;
        }

        if (event.target.value.length === 4) {
            setLoading(true);
            const response = await AxiosPost(`/api/login`, {
                pin: event.target.value,
            });
            if (!response?.error) {
                sendAlert(
                    `${response?.firstName} ${response?.lastName} has been logged in.`,
                    {
                        variant: "success",
                    }
                );
            } else {
                sendAlert("Pin not valid.", {
                    variant: "warning",
                });
            }
            setLoading(false);
        }
    };

    const getNumpad = () => {
        const numbers = [];

        for (let number = 0; number < 10; number++) {
            numbers.push(
                <Grid key={number} item xs={4}>
                    <Card
                        onClick={(event) => {
                            handlePress(number.toString());
                        }}
                        variant="outlined"
                    >
                        <CardActionArea>
                            <Typography
                                className={classes.number}
                                align="center"
                                variant="h4"
                            >
                                {number}
                            </Typography>
                        </CardActionArea>
                    </Card>
                </Grid>
            );
        }

        return (
            <Grid container spacing={2} justify="center" alignItems="center">
                {numbers}
                <Grid item xs={4}>
                    <Card onClick={handleDelete} variant="outlined">
                        <CardActionArea>
                            <Typography
                                className={classes.number}
                                align="center"
                                variant="h4"
                            >
                                <BackspaceIcon fontSize="inherit" />
                            </Typography>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    if (loading) {
        return <LoadingOverlay />;
    }

    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        className={classes.form}
                        onChange={(event) => handleChange(event)}
                        error={error ? true : false}
                        value={pin}
                        variant="outlined"
                        fullWidth
                        type="string"
                    />
                    <Grid item xs={12}>
                        {getNumpad()}
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
}
