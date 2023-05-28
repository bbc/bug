import React from "react";
import Box from "@mui/material/Box";
import ScaleText from "react-scale-text";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function BugStatusBlock({ items, label, state, sx = {}, image }) {
    const stateColors = {
        success: "#05990c",
        warning: "#d07111",
        error: "#b52424",
        info: "#337ab7",
        inactive: "#262626",
    };

    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("lg"));

    if (image) {
        return (
            <Box sx={{ marginTop: "32px", padding: "4px", display: "inline-block", verticalAlign: "top", ...sx }}>
                <img
                    style={{
                        height: isSmall ? "90px" : "120px",
                    }}
                    src={image}
                    alt=""
                />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "4px", display: "inline-block", verticalAlign: "top", ...sx }}>
            <Box
                sx={{
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.5)",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "500",
                    padding: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {label}&nbsp;
            </Box>
            <Box
                sx={{
                    width: isSmall ? "90px" : "120px",
                    height: isSmall ? "90px" : "120px",
                    backgroundColor: stateColors[state],
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    padding: "8px 8px 12px 8px",
                    "& .scaletext-wrapper": {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                }}
            >
                {items &&
                    items.map((item, index) => (
                        <ScaleText key={index} maxFontSize={isSmall ? 24 : 34}>
                            <div style={{ whiteSpace: "nowrap", fontWeight: 500 }}>{item}</div>
                        </ScaleText>
                    ))}
            </Box>
        </Box>
    );
}
