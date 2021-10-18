import React from "react";
import Box from "@mui/material/Box";

export default function BugVolumeBar({ min = 0, max = 100, value, height = 100, width = 6 }) {
    const valueHeight = ((value - min) / (max - min)) * 100;
    return (
        <Box
            sx={{
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
