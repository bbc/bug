import React from "react";
import Statistics from "../components/Statistics";
import DelayChart from "../components/DelayChart";
import LossChart from "../components/LossChart";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function TabStatistics() {
    const theme = useTheme();
    const params = useParams();
    const isXLView = useMediaQuery(theme.breakpoints.up("xl"));

    return (
        <Grid container spacing={1}>
            <Grid
                item
                xs={12}
                lg={12}
                xl={5}
                sx={{
                    borderRightWidth: isXLView ? "4px" : "0px",
                    borderRightStyle: "solid",
                    borderRightColor: "border.light",
                }}
            >
                <Statistics panelId={params.panelId} />
            </Grid>
            <Grid item xs={12} lg={12} xl={7}>
                <Grid container spacing={1} sx={{ marginBottom: "8px" }}>
                    <Grid item xs={12}>
                        <DelayChart panelId={params.panelId} />
                    </Grid>
                    <Grid item xs={12}>
                        <LossChart panelId={params.panelId} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
