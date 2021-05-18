import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import ProgressCounter from "@components/ProgressCounter";
import Hidden from "@material-ui/core/Hidden";

const useStyles = makeStyles((theme) => ({
    text: {
        fontSize: "3rem",
        "@media (max-width:600px)": {
            fontSize: "1.5rem",
        },
    },
}));

export default function PanelBuilding(props) {
    const classes = useStyles();

    const CircularProgressWithLabel = (props) => {
        const Value = ({ value }) => {
            if (value > -1) {
                return (
                    <Typography variant="caption" component="div" color="textSecondary" className={classes.text}>
                        <ProgressCounter value={Math.round(props.value)} />%
                    </Typography>
                );
            } else {
                return null;
            }
        };

        return (
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
                    <Value value={props.value} />
                </Box>
            </Box>
        );
    };

    return (
        <>
            <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                <h3>Panel is starting ...</h3>
                <Grid item xs={3}>
                    <CircularProgressWithLabel value={props.panel?._buildStatus?.progress} />
                </Grid>
            </Grid>
        </>
    );
}
