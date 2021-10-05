import React, { useEffect } from "react";
import HomeTiles from "@components/home/HomeTiles";
import BugQuote from "@components/BugQuote";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PageHome() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Home"));
    }, [dispatch]);

    return (
        <>
            <HomeTiles />

            <Grid container>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            margin: "auto",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <BugQuote />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
