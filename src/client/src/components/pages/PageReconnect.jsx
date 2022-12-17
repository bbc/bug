import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";

export default function PageReconnect({ connection = false }) {
    const handleReloadClicked = () => {
        window.location.reload();
    };

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", backdropFilter: "blur(6px)", zIndex: (theme) => theme.zIndex.drawer + 2 }}
                open={!connection}
            >
                <Grid container spacing={0} alignItems="center" justify="center" sx={{ minHeight: "100vh" }}>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={0}
                            sx={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: 20,
                                    textAlign: "center",
                                    margin: "16px",
                                    "@media (max-width:600px)": {
                                        fontSize: 16,
                                        margin: "8px",
                                    },
                                    "@media (max-height:400px) and (max-width:800px)": {
                                        fontSize: 20,
                                        margin: "6px",
                                    },
                                }}
                            >
                                Cannot connect to BUG server
                            </Typography>
                            <Grid
                                item
                                xs={3}
                                sx={{
                                    margin: "16px",
                                }}
                            >
                                <Box position="relative" display="inline-flex">
                                    <CircularProgress size={`6rem`} />

                                    <Box
                                        top={0}
                                        left={0}
                                        bottom={0}
                                        right={0}
                                        position="absolute"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    ></Box>
                                </Box>
                            </Grid>
                            <Button
                                onClick={handleReloadClicked}
                                variant="contained"
                                color="primary"
                                disableElevation
                                sx={{
                                    margin: "16px",
                                    "@media (max-width:600px)": {
                                        margin: "8px",
                                    },
                                    "@media (max-height:400px) and (max-width:800px)": {
                                        margin: "4px",
                                    },
                                }}
                            >
                                Reload Page
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Backdrop>
        </>
    );
}
