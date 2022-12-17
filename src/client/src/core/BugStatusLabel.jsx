import React from "react";
import Box from "@mui/material/Box";

export default function BugStatusLabel({ sx, color = "primary.main", children }) {
    return (
        <Box
            sx={{
                color: color,
                textTransform: "uppercase",
                opacity: "0.8",
                fontSize: "0.8rem",
                fontWeight: "500",
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}
