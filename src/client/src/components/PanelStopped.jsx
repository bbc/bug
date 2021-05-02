import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";

export default function PanelStopped(props) {
    return (
        <>
            <Grid container spacing={0} direction="column" alignItems="center" justify="center">
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
                        >
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
