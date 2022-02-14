import React from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

export default function BugChipDisplay({ options }) {
    if (!options) {
        return null;
    }
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > *": {
                    margin: "0.5px",
                },
            }}
        >
            {options.map((option) => (
                <Chip key={option} label={option} />
            ))}
        </Box>
    );
}
