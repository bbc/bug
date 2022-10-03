import React from "react";
import Box from "@mui/material/Box";

export default function StateLabel({ state }) {
    const stateColors = {
        Connected: "success.main",
        Disconnected: "warning.main",
        Idle: "secondary.main",
    };
    return (
        <Box
            sx={{
                textTransform: "uppercase",
                opacity: 0.8,
                fontWeight: 500,
                color: stateColors[state] ? stateColors[state] : "secondary.main",
            }}
        >
            {state}
        </Box>
    );
}
