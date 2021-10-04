import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
}));

export default function LoadingOverlay(props) {
    const classes = useStyles();

    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: "100vh" }}
            >
                <Backdrop className={classes.backdrop} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Grid>
        </>
    );
}
