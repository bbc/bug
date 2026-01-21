import BugQuote from "@components/BugQuote";
import HomeTiles from "@components/home/HomeTiles";
import { Box, Grid } from "@mui/material";
import pageTitleSlice from "@redux/pageTitleSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PageHome() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Home"));
    }, [dispatch]);

    return (
        <>
            <HomeTiles />

            <Grid container>
                <Grid size={{ xs: 12 }}>
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
