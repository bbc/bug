import React from "react";
import Box from "@mui/material/Box";

export default function BugStatusLabel({ sx = {}, children }) {
    return (
        <Box
            sx={{
                color: "primary.main",
                textTransform: "uppercase",
                opacity: "0.9",
                fontSize: "0.8rem",
                fontWeight: "500",
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}
