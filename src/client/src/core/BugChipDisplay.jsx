import React from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

export default function BugChipDisplay({ sx = {}, options, avatar = undefined }) {
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
                ...sx,
            }}
        >
            {options.map((option) => (
                <Chip avatar={avatar} key={option} label={option} />
            ))}
        </Box>
    );
}
