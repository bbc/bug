import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    form: {
        padding: 0,
        paddingTop: 32,
        "@media (max-height:400px) and (max-width:800px)": {
            padding: 16,
        },
    },
    button: {
        borderRadius: 0,
        fontSize: 14,
        marginTop: 16,
        marginBottom: 16,
        height: 60,
        "@media (max-height:400px) and (max-width:800px)": {
            marginBottom: 8,
        },
    },
}));

export default function LocalLogin({ handleLogin }) {
    const classes = useStyles();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const onSubmit = async (form) => {
        handleLogin(form);
    };

    return (
        <div className={classes.form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <TextField
                            inputProps={{ ...register("username") }}
                            fullWidth
                            error={errors?.username ? true : false}
                            type="text"
                            variant="standard"
                            label="Username"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            inputProps={{ ...register("password") }}
                            fullWidth
                            error={errors?.password ? true : false}
                            type="password"
                            variant="standard"
                            label="Password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            disableElevation
                            className={classes.button}
                        >
                            SIGN IN
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
