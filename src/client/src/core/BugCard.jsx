import React from "react";
import Card from "@mui/material/Card";

export default function BugCard({ minHeight = "auto", fullHeight = false, children, ...props }) {
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
                minHeight: minHeight,
                minWidth: 300,
                textAlign: "left",
                color: "text.secondary",
                position: "relative",
                ...fullHeightProps,
            }}
            {...props}
        >
            {children}
        </Card>
    );
}
