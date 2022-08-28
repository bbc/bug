import React from "react";
import Statistics from "../components/Statistics";
import DelayChart from "../components/DelayChart";
import LossChart from "../components/LossChart";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import BugCard from "@core/BugCard";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

export default function TabStatistics() {
    const params = useParams();

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} lg={12} xl={5}>
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
