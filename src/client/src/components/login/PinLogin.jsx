import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import { useAlert } from "@utils/Snackbar";
import LoadingOverlay from "@components/LoadingOverlay";
import AxiosPost from "@utils/AxiosPost";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    number: {
        margin: theme.spacing(2),
    },
    form: {
        margin: theme.spacing(2),
    },
}));

export default function PinLogin() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});
    const classes = useStyles();
    const sendAlert = useAlert();
    const [loading, setLoading] = useState(false);

    const getNumpad = (form) => {
        const numbers = [];

        for (let number = 0; number < 10; number++) {
            numbers.push(
                <Grid item xs={4}>
                    <Card>
                        <Typography
                            className={classes.number}
                            align="center"
                            variant="h4"
                        >
                            {number}
                        </Typography>
                    </Card>
                </Grid>
            );
        }

        return (
            <Grid container spacing={2} justify="center" alignItems="center">
                {numbers}
            </Grid>
        );
    };

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPost(`/api/login`, form);
        if (!response?.error) {
            sendAlert(`User has been logged in.`, {
                variant: "success",
            });
        } else {
            sendAlert(`User could not be logged in.`, {
                variant: "warning",
            });
        }
        setLoading(false);
    };

    if (loading) {
        return <LoadingOverlay />;
    }

    return (
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("pin") }}
                        variant="filled"
                        fullWidth
                        error={errors?.pin ? true : false}
                        type="pin"
                        label="Pin"
                    />
                    <Grid item xs={12}>
                        {getNumpad()}
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
}
