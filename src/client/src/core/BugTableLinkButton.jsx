import React from "react";
import Link from "@mui/material/Link";

export default function BugTableLinkButton(props) {
    return (
        <Link
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
            }}
            component="button"
            onClick={props?.onClick}
        >
            {props.children}
        </Link>
    );
}
