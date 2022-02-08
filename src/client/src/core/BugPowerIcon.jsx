import React from "react";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";

export default function BugPowerIcon({ disabled = false }) {
    return (
        <PowerSettingsNew
            sx={{
                color: disabled ? "#ffffff" : "primary.main",
                opacity: disabled ? 0.1 : 1,
                display: "block",
                margin: "auto",
            }}
        />
    );
}
