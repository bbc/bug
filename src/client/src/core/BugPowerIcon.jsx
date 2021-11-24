import React from "react";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";

export default function BugPowerIcon(props) {
    const enabled = props && props.enabled;
    return (
        <PowerSettingsNew
            sx={{
                color: enabled ? "primary.main" : "#ffffff",
                opacity: enabled ? 1 : 0.1,
                display: "block",
                margin: "auto",
            }}
        />
    );
}
