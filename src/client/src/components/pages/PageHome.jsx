import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import HomeTiles from "@components/home/HomeTiles";
import BugQuote from "@components/BugQuote";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
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
