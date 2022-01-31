import React from "react";
import Link from "@mui/material/Link";

export default function BugTableLinkButton({ onClick, children, variant = "primary", disabled = false }) {
    return (
        <Link
            disabled={disabled}
            sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                color: variant === "primary" ? "#ffffff" : "#666",
                fontFamily: "fontFamily",
                fontSize: "0.875rem",
                lineHeight: 1.43,
                display: "block",
                maxWidth: "100%",
                textAlign: "left",
                margin: "1px 0px",
                opacity: disabled ? 0.3 : 1,
                textDecoration: "none",
                "&:hover": {
                    textDecoration: disabled ? "none" : "underline",
                },
            }}
            component="button"
            onClick={onClick}
        >
            {children}
        </Link>
    );
}
