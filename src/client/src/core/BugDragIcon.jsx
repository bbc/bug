import React from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export default function BugDragIcon({ sx = {}, color = "primary" }) {
    return (
        <DragIndicatorIcon
            sx={{
                opacity: 0.6,
                color: `${color}.main`,
                marginTop: "2px",
                ...sx,
            }}
        />
    );
}
