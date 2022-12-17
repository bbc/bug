import React from "react";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function AutoLogin({ handleLogin }) {
    const { handleSubmit } = useForm({});

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
