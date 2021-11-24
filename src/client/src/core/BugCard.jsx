import React from "react";
import Card from "@mui/material/Card";

export default function BugCard({ children, ...props }) {
    return (
        <Card
            sx={{
                minWidth: 300,
                textAlign: "left",
                color: "text.secondary",
                position: "relative",
            }}
            {...props}
        >
            {children}
        </Card>
    );
}
