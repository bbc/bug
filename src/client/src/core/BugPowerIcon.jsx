import React from "react";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";

export default function BugPowerIcon({ disabled = false, sx = {}, color = "primary.main" }) {
    return (
        <PowerSettingsNew
            sx={{
                color: disabled ? "#ffffff" : color,
                opacity: disabled ? 0.1 : 1,
                display: "block",
                margin: "auto",
                ...sx,
            }}
        />
    );
}
