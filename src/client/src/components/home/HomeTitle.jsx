import React from "react";
import Box from "@mui/material/Box";

export default function HomeTitle() {
    return (
        <Box
            sx={{
                backgroundColor: theme.palette.menu.main,
                width: "100%",
                color: "#ffffff",
                fontSize: "2.5rem",
                padding: "0.5rem 1rem",
            }}
        >
            Welcome to BUG
        </Box>
    );
}
