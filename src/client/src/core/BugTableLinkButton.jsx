import { Link } from "@mui/material";

export default function BugTableLinkButton({ sx = {}, children, disabled = false, onClick }) {
    return (
        <Link
            disabled={disabled}
            sx={{
                color: "text.primary",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                fontFamily: "fontFamily",
                fontSize: "0.875rem",
                lineHeight: 1.43,
                display: "block",
                maxWidth: "100%",
                textAlign: "left",
                margin: "1px 0px",
                opacity: disabled ? 0.4 : 1,
                textDecoration: "none",
                cursor: disabled ? "default" : "pointer",
                "&:hover": {
                    textDecoration: disabled ? "none" : "underline",
                },
                ...sx,
            }}
            component="button"
            onClick={onClick}
        >
            {children}
        </Link>
    );
}
