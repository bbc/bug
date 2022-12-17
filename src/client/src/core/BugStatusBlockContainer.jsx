import React from "react";
import Box from "@mui/material/Box";
import BugStatusBlock from "@core/BugStatusBlock";

export default function BugStatusBlockContainer({ items }) {
    return (
        <Box
            sx={{
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    display: "block",
                    marginBottom: "8px",
                }}
            >
                {items &&
                    items.map((statusItem, index) => (
                        <BugStatusBlock
                            label={statusItem.label}
                            state={statusItem.state}
                            key={index}
                            items={statusItem.items}
                        />
                    ))}
            </Box>
        </Box>
    );
}
