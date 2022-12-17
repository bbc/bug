import React from "react";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";

export default function BugPowerIcon({
    disabled = false,
    sx,
    disabledColor = "#ffffff",
    activeColor = "primary.main",
}) {
    return (
        <PowerSettingsNew
            sx={{
                ...sx,
                color: disabled ? disabledColor : activeColor,
                opacity: disabled ? 0.1 : 1,
                display: "block",
                margin: "auto",
            }}
        />
    );
}
