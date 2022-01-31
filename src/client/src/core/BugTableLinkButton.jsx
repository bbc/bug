import React from "react";
import Link from "@mui/material/Link";

export default function BugTableLinkButton({ onClick, children, variant = null, disabled = false }) {
    let color = "#ffffff";
    if (variant) {
        color = `${variant}.main`;
    }

    return (
        <Link
            disabled={disabled}
            sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                color: color,
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
