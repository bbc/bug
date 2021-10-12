import React from "react";
import Box from "@mui/material/Box";

export default function BugVolumeBar({ min = 0, max = 100, value, height = 100, width = 6 }) {
    const valueHeight = ((value - min) / (max - min)) * height;
    return (
        <Box
            sx={{
                height: height,
                width: width,
                position: "relative",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    backgroundColor: "green",
                    width: width,
                    height: valueHeight,
                }}
            ></Box>
        </Box>
    );
}
