import React from "react";
import { useApiPoller } from "@hooks/ApiPoller";
import BugVolumeBar from "@core/BugVolumeBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function VolumeBars({ panelId }) {
    const levels = useApiPoller({
        url: `/container/${panelId}/audio/`,
        interval: 500,
    });

    if (!levels?.data) {
        return null;
    }

    return (
        <Grid container>
            <Grid sx={{ margin: "1rem" }}>
                <Box
                    sx={{
                        fontSize: "0.875rem",
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: "500",
                        textTransform: "uppercase",
                        // marginTop: "1rem",
                        margin: "8px",
                        textAlign: "center",
                    }}
                >
                    Send
                </Box>
                <Grid container direction="row">
                    <Box sx={{ margin: "8px" }}>
                        <BugVolumeBar max={72} min={0} value={levels["data"]["output-left"]} width={30} />
                        <Box sx={{ fontWeight: 700, textAlign: "center", fontSize: "14px", margin: "4px" }}>L</Box>
                    </Box>
                    <Box sx={{ margin: "8px" }}>
                        <BugVolumeBar max={72} min={0} value={levels["data"]["output-right"]} width={30} />
                        <Box sx={{ fontWeight: 700, textAlign: "center", fontSize: "14px", margin: "4px" }}>R</Box>
                    </Box>
                </Grid>
            </Grid>
            <Grid sx={{ margin: "1rem" }}>
                <Box
                    sx={{
                        fontSize: "0.875rem",
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: "500",
                        textTransform: "uppercase",
                        // marginTop: "1rem",
                        margin: "8px",
                        textAlign: "center",
                    }}
                >
                    Receive
                </Box>
                <Grid container direction="row">
                    <Box sx={{ margin: "8px" }}>
                        <BugVolumeBar max={72} min={0} value={levels["data"]["input-left"]} width={30} />
                        <Box sx={{ fontWeight: 700, textAlign: "center", fontSize: "14px", margin: "4px" }}>L</Box>
                    </Box>
                    <Box sx={{ margin: "8px" }}>
                        <BugVolumeBar max={72} min={0} value={levels["data"]["input-right"]} width={30} />
                        <Box sx={{ fontWeight: 700, textAlign: "center", fontSize: "14px", margin: "4px" }}>R</Box>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}
