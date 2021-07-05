import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    page: {
        "@media (max-height:400px) and (max-width:800px)": {
            padding: 24,
        },
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        marginLeft: 16,
        marginRight: 16,
        "@media (max-width:600px)": {
            fontSize: 16,
        },
    },
    spinner: {
        margin: 16,
    },
    button: {
        margin: 16,
    },
}));

export default function PageReconnect(props) {
    const classes = useStyles();

    const handleReloadClicked = () => {
        window.location.reload();
    };

    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                className={classes.page}
            >
                <h3 className={classes.title}>Cannot connect to BUG server - please wait</h3>
                <Grid item xs={3} className={classes.spinner}>
                    <Box position="relative" display="inline-flex">
                        <Hidden xsDown>
                            <CircularProgress size={`8rem`} />
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
                <Button
                    onClick={handleReloadClicked}
                    variant="contained"
                    color="primary"
                    disableElevation
                    className={classes.button}
                >
                    Reload Page
                </Button>
            </Grid>
        </>
    );
}
