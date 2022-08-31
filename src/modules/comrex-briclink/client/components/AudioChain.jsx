import React from "react";
import AudioChart from "../components/AudioChart";
import BugVolumeBar from "@core/BugVolumeBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function AudioChain({ levels, history, type }) {
    return (
        <>
            <Box
                sx={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    textAlign: "center",
                    backgroundColor: "#212121",
                    padding: "1rem",
                }}
            >
                {type === "output" ? "Send" : "Receive"}
            </Box>
            <Grid container>
                <Grid sx={{ margin: "1rem", display: "flex" }}>
                    <Box sx={{ margin: "8px" }}>
                        <BugVolumeBar
                            max={72}
                            min={0}
                            value={levels?.["data"][`${type}-left`]}
                            width={30}
                            height={170}
                        />
                        <Box sx={{ fontWeight: 700, textAlign: "center", fontSize: "14px", margin: "4px" }}>L</Box>
                    </Box>
                    <Box sx={{ margin: "8px" }}>
                        <BugVolumeBar
                            max={72}
                            min={0}
                            value={levels?.["data"][`${type}-right`]}
                            width={30}
                            height={170}
                        />
                        <Box sx={{ fontWeight: 700, textAlign: "center", fontSize: "14px", margin: "4px" }}>R</Box>
                    </Box>
                </Grid>
                <Grid sx={{ margin: "1rem", flexGrow: 1 }}>
                    <AudioChart stats={history?.data} type={type} />
                </Grid>
            </Grid>
        </>
    );
}
