import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Hidden from "@mui/material/Hidden";

export default function PanelRestarting(props) {
    return (
        <>
            <Grid
                container
                spacing={0}
                sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h3>Panel is restarting ...</h3>
                <Grid item xs={3}>
                    <Box position="relative" display="inline-flex">
                        <Hidden xsDown>
                            <CircularProgress size={`12rem`} />
                        </Hidden>
                        <Hidden smUp>
                            <CircularProgress size={`6rem`} />
                        </Hidden>

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
            </Grid>
        </>
    );
}
