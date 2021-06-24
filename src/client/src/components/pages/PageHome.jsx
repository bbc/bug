import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import HomeTiles from "@components//HomeTiles";
import BugQuote from "@components/BugQuote";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

const useStyles = makeStyles((theme) => ({
    tile: {
        position: "relative",
        display: "flex",
        margin: "auto",
        flexDirection: "row",
        alignItems: "center",
    },
    quote: {
        margin: theme.spacing(1),
        color: theme.palette.primary.main,
        fontSize: "1.1rem",
    },
}));

export default function PageHome() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Home"));
    }, [dispatch]);

    return (
        <>
            <HomeTiles />

            <Grid container>
                <Grid item xs={12}>
                    <Box className={classes.tile}>
                        <Typography variant="body2" component="p" className={classes.quote}>
                            <BugQuote />
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
