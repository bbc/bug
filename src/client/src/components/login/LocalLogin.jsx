import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";

export default function LocalLogin({ handleLogin }) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({});

    const onSubmit = async (form) => {
        handleLogin(form);
    };

    return (
        <Box
            sx={{
                padding: "0px",
                paddingTop: "32px",
                "@media (max-height:400px) and (max-width:800px)": {
                    padding: "16px",
                },
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <BugConfigFormTextField
                            name="username"
                            control={control}
                            fullWidth
                            error={errors?.username}
                            variant="outlined"
                            label="Username"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <BugConfigFormPasswordTextField
                            name="password"
                            control={control}
                            fullWidth
                            error={errors?.password}
                            variant="outlined"
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
                            sx={{
                                borderRadius: "0px",
                                fontSize: "14px",
                                marginTop: "16px",
                                marginBottom: "16px",
                                height: "60px",
                                "@media (max-height:400px) and (max-width:800px)": {
                                    marginBottom: "8px",
                                },
                            }}
                        >
                            SIGN IN
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
