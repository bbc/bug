import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, IconButton } from "@mui/material";
import React from "react";

export default function BugTileStatus({ statusItems }) {
    const [statusIndex, setStatusIndex] = React.useState(0);

    const stateColors = {
        success: ["#05990c", "#ffffff"],
        warning: ["#d07111", "#ffffff"],
        critical: ["#b52424", "#ffffff"],
        info: ["#337ab7", "#ffffff"],
        default: ["#212121", "#aaaaaa"],
    };

    const currentStatusItem = statusItems[statusIndex];

    return (
        <Box
            sx={{
                backgroundColor: stateColors[currentStatusItem.type][0] || "#1a1a1a",
                color: stateColors[currentStatusItem.type][1] || "#ffffff",
                borderTop: `1px solid #121212`,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    paddingLeft: "14px",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        marginTop: "14px",
                        marginBottom: "14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {Array.isArray(currentStatusItem.message)
                        ? currentStatusItem.message[0]
                        : currentStatusItem.message}
                </Box>

                <Box
                    sx={{
                        whiteSpace: "nowrap",
                    }}
                >
                    <IconButton
                        disabled={statusItems.length === 0 || statusIndex === 0}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            if (statusIndex > 0) {
                                setStatusIndex(statusIndex - 1);
                            }
                        }}
                    >
                        <ArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        disabled={statusItems.length === 0 || statusIndex === statusItems.length - 1}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            if (statusIndex < statusItems.length - 1) {
                                setStatusIndex(statusIndex + 1);
                            }
                        }}
                    >
                        <ArrowRightIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}
