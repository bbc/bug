import React from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export default function BugDragIcon({ sx = {} }) {
    return (
        <DragIndicatorIcon
            sx={{
                color: "primary.main",
                opacity: 0.6,
                marginTop: "2px",
                ...sx,
            }}
        />
    );
}
