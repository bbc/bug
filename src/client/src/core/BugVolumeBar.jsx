import React from "react";
import Box from "@mui/material/Box";

export default function BugVolumeBar({ max = 100, min = 0, value, width = "6px", height = "100px" }) {
    const valueHeight = ((value - min) / (max - min)) * 100;
    return (
        <Box
            sx={{
                height: height,
                width: width,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                backgroundColor: "#01480180",
            }}
        >
            <Box
                sx={{
                    bottom: 0,
                    backgroundColor: "green",
                    width: width,
                    height: `${valueHeight}%`,
                }}
            ></Box>
        </Box>
    );
}
