import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import Grid from "@material-ui/core/Grid";

export default function LocalLogin({ handleLogin }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const onSubmit = async (form) => {
        handleLogin(form);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("email") }}
                        fullWidth
                        error={errors?.email ? true : false}
                        type="email"
                        label="Email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("password") }}
                        fullWidth
                        error={errors?.password ? true : false}
                        type="password"
                        label="Password"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disableElevation
                    >
                        Login
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
