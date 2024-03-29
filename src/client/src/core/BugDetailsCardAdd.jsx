import React from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

export default function BugDetailsCard({ width, sx = {}, onAdd, ...props }) {
    return (
        <Card
            sx={{
                minWidth: 300,
                textAlign: "center",
                color: "text.secondary",
                position: "relative",
                marginBottom: "8px",
                padding: "8px",
                ...sx,
            }}
            {...props}
        >
            <IconButton onClick={onAdd}>
                <AddIcon />
            </IconButton>
        </Card>
    );
}
