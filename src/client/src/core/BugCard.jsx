import React from "react";
import Card from "@mui/material/Card";

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
