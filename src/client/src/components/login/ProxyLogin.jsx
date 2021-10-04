import React from "react";
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
    const { handleSubmit } = useForm({});

    const onSubmit = async (form) => {
        handleLogin(form);
    };

    return (
        <div className={classes.form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
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
