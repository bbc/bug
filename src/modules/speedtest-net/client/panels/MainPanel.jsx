import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import SpeedCard from "./../components/SpeedCard";
export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <Grid container spacing={4}>
                <SpeedCard url={`/container/${params.panelId}/download/stats`} units="Mb/s" title="Download" />
                <SpeedCard url={`/container/${params.panelId}/upload/stats`} units="Mb/s" title="Upload" />
            </Grid>
        </>
    );
}
