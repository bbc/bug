import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, IconButton } from "@mui/material";
import React from "react";

// Canonical status order
const statusOrder = ["critical", "error", "warning", "info", "success", "default"];
const statusRank = statusOrder.reduce((acc, type, index) => {
    acc[type] = index;
    return acc;
}, {});

export default function BugTileStatus({ statusItems }) {
    const [statusIndex, setStatusIndex] = React.useState(0);

    const stateColors = {
        success: ["#05990c", "#ffffff"],
        warning: ["#d07111", "#ffffff"],
        critical: ["#b52424", "#ffffff"],
        info: ["#337ab7", "#ffffff"],
        default: ["#212121", "#aaaaaa"],
    };

    // Sort statusItems by priority
    const sortedStatusItems = React.useMemo(() => {
        if (!Array.isArray(statusItems)) return [];
        return [...statusItems].sort((a, b) => {
            const rankA = statusRank[a?.type] ?? statusRank.default;
            const rankB = statusRank[b?.type] ?? statusRank.default;
            return rankA - rankB;
        });
    }, [statusItems]);

    // Reset index if out of bounds
    React.useEffect(() => {
        if (statusIndex >= sortedStatusItems.length) {
            setStatusIndex(0);
        }
    }, [sortedStatusItems, statusIndex]);

    const currentStatusItem = sortedStatusItems[statusIndex];
    const type = stateColors[currentStatusItem?.type] ? currentStatusItem?.type : "warning";

    if (!stateColors[currentStatusItem?.type]) {
        console.warn(`BugStatusItem: Unknown status type: ${currentStatusItem?.type}`);
    }

    return (
        <Box
            sx={{
                backgroundColor: stateColors[type][0] || "#1a1a1a",
                color: stateColors[type][1] || "#ffffff",
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
                    {Array.isArray(currentStatusItem?.message)
                        ? currentStatusItem.message[0]
                        : currentStatusItem?.message}
                </Box>

                <Box sx={{ whiteSpace: "nowrap" }}>
                    <IconButton
                        disabled={sortedStatusItems.length === 0 || statusIndex === 0}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            if (statusIndex > 0) setStatusIndex(statusIndex - 1);
                        }}
                    >
                        <ArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        disabled={sortedStatusItems.length === 0 || statusIndex === sortedStatusItems.length - 1}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            if (statusIndex < sortedStatusItems.length - 1) setStatusIndex(statusIndex + 1);
                        }}
                    >
                        <ArrowRightIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}
