import React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

export default function BugDetailsCard({ width, onAdd, ...props }) {
    return (
        <Card
            sx={{
                minWidth: 300,
                textAlign: "center",
                color: "text.secondary",
                position: "relative",
                marginBottom: "8px",
                padding: "8px",
            }}
            {...props}
        >
            <IconButton onClick={onAdd}>
                <AddIcon />
            </IconButton>
        </Card>
    );
}
