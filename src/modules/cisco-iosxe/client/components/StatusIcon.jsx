import React from "react";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function StatusIcon({ status }) {
    if (status === "if-oper-state-ready") {
        return (
            <PowerSettingsNew
                sx={{
                    color: "primary.main",
                    display: "block",
                    margin: "auto",
                }}
            />
        );
    }
    if (status === "err-disable") {
        return (
            <ErrorOutlineIcon
                sx={{
                    color: "warning.main",
                    display: "block",
                    margin: "auto",
                    paddingLeft: "1px",
                }}
            />
        );
    }
    return (
        <PowerSettingsNew
            sx={{
                color: "#ffffff",
                opacity: 0.1,
                display: "block",
                margin: "auto",
            }}
        />
    );
}
