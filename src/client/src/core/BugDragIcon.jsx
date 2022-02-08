import React from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export default function BugDragIcon(props) {
    return (
        <DragIndicatorIcon
            {...props}
            sx={{
                opacity: 0.6,
                color: "primary.main",
                marginTop: "4px",
            }}
        />
    );
}
