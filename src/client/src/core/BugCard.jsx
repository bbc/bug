import React from "react";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";

export default function BugCard({ sx = {}, fullHeight = false, children }) {
    const fullHeightProps = fullHeight
        ? {
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
          }
        : {};
    return (
        <Card
            component={Paper}
            square
            elevation={0}
            sx={{
                minHeight: "auto",
                minWidth: 300,
                textAlign: "left",
                color: "text.secondary",
                position: "relative",
                ...fullHeightProps,
                ...sx,
            }}
        >
            {children}
        </Card>
    );
}
