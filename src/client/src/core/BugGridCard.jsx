import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

export default function BugGridCard({ title, children, ...props }) {
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
            {title && <CardHeader title={title} />}
            {children}
        </Card>
    );
}
