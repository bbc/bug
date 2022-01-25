import React from "react";
import Link from "@mui/material/Link";

export default function BugTableLinkButton({ onClick, children, disabled }) {
    return (
        <Link
            disabled={disabled}
            sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                color: "#ffffff",
                fontFamily: "fontFamily",
                fontSize: "0.875rem",
                lineHeight: 1.43,
                display: "block",
                maxWidth: "100%",
                textAlign: "left",
                opacity: disabled ? 0.5 : 1,
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
