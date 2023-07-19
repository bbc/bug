import React from "react";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import ErrorIcon from "@mui/icons-material/Error";

export default function StatusIcon({ status }) {
    if (status === "connected") {
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
    if (status === "errdisabled") {
        return (
            <ErrorIcon
                sx={{
                    color: "error.main",
                    display: "block",
                    margin: "auto",
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
