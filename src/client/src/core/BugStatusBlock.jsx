import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { memo } from "react";

const StatusValue = memo(function StatusValue({ children, fontSize, compact = false }) {
    return (
        <Box
            sx={{
                width: "100%",
                height: compact ? "auto" : "100%",
                display: compact ? "block" : "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "500",
                fontFamily: "Fira Code",
                lineHeight: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: `${fontSize}px`,
                textAlign: "center",
            }}
        >
            {children}
        </Box>
    );
});

const normalizeStatusItem = (item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
        return {
            value: item.value ?? "",
            size: String(item.size ?? "auto")
                .trim()
                .toLowerCase(),
        };
    }

    return {
        value: item,
        size: "auto",
    };
};

const getRowWeight = (size, itemCount) => {
    if (itemCount <= 1) {
        return 1;
    }

    switch (size) {
        case "small":
            return 0.85;
        case "medium":
            return 1;
        case "large":
            return 1.6;
        case "auto":
        default:
            return 1;
    }
};

const getSizeConfig = (size, isSmall, itemCount) => {
    const isSingle = itemCount === 1;

    switch (size) {
        case "small":
            return {
                widthFactor: 0.72,
                heightFactor: 0.68,
                maxSize: isSmall ? 18 : isSingle ? 22 : 20,
            };
        case "medium":
            return {
                widthFactor: 0.62,
                heightFactor: 0.75,
                maxSize: isSmall ? 22 : isSingle ? 36 : 30,
            };
        case "large":
            return {
                widthFactor: 0.52,
                heightFactor: 0.9,
                maxSize: isSmall ? 24 : isSingle ? 48 : 40,
            };
        case "auto":
        default:
            return {
                widthFactor: 0.58,
                heightFactor: 0.8,
                maxSize: isSmall ? (isSingle ? 24 : 22) : 56,
            };
    }
};

const getStatusFontSize = (value, size, isSmall, itemCount, gapPx = 0, rowHeightOverride) => {
    const text = String(value ?? "");
    const availableWidth = isSmall ? 74 : 104;
    const availableHeight = isSmall ? 74 : 104;
    const rowHeight =
        rowHeightOverride ??
        (itemCount > 1 ? (availableHeight - (itemCount - 1) * gapPx) / itemCount : availableHeight);
    const sizeConfig = getSizeConfig(size, isSmall, itemCount);
    const widthBased = availableWidth / Math.max(text.length * sizeConfig.widthFactor, 1);
    const heightBased = rowHeight * sizeConfig.heightFactor;
    return Math.max(10, Math.min(sizeConfig.maxSize, Math.floor(Math.min(widthBased, heightBased))));
};

export default function BugStatusBlock({ items, label, state, sx = {}, image }) {
    const stateColors = {
        success: "#05990c",
        warning: "#d07111",
        error: "#b52424",
        info: "#337ab7",
        inactive: "#262626",
    };

    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("lg"));
    const tileSize = isSmall ? "90px" : "120px";
    const tileHeight = isSmall ? "90px" : "150px";
    const statusItems = (items || []).map(normalizeStatusItem);
    const itemGap = statusItems.length > 1 ? (statusItems.length === 2 ? 2 : 4) : 0;
    const availableHeight = isSmall ? 74 : 104;
    const totalGapHeight = statusItems.length > 1 ? (statusItems.length - 1) * itemGap : 0;
    const totalWeight = Math.max(
        1,
        statusItems.reduce((sum, item) => sum + getRowWeight(item.size, statusItems.length), 0)
    );

    if (state === "spacer") {
        const width = isSmall ? "12px" : "16px";
        return <Box sx={{ width: width, minWidth: width, flex: `0 0 ${width}`, ...sx }} />;
    }

    if (image) {
        return (
            <Box
                sx={{
                    marginTop: "29px", // because of the 1px border
                    padding: "0px",
                    display: "inline-block",
                    verticalAlign: "top",
                    ...sx,
                }}
            >
                <img
                    style={{
                        height: tileSize,
                    }}
                    src={image}
                    alt=""
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: tileSize,
                height: tileHeight,
                minHeight: tileHeight,
                maxHeight: tileHeight,
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflow: "hidden",
                verticalAlign: "top",
                ...sx,
            }}
        >
            <Box
                sx={{
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.5)",
                    textAlign: "center",
                    fontSize: isSmall ? "12px" : "14px",
                    fontWeight: "500",
                    lineHeight: 1,
                    padding: "4px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    height: isSmall ? "26px" : "30px",
                }}
            >
                {label}&nbsp;
            </Box>

            <Box
                sx={{
                    width: tileSize,
                    height: tileSize,
                    backgroundColor: stateColors[state],
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                    gap: `${itemGap}px`,
                    overflow: "hidden",
                    boxSizing: "border-box",
                    minWidth: 0,
                    minHeight: 0,
                }}
            >
                {statusItems.map((item, index) =>
                    (() => {
                        const rowWeight = getRowWeight(item.size, statusItems.length);
                        const rowHeight = ((availableHeight - totalGapHeight) / totalWeight) * rowWeight;

                        return (
                            <Box
                                key={index}
                                sx={{
                                    flex: `${rowWeight} 1 0`,
                                    width: "100%",
                                    minWidth: 0,
                                    minHeight: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <StatusValue
                                    fontSize={getStatusFontSize(
                                        item.value,
                                        item.size,
                                        isSmall,
                                        statusItems.length,
                                        itemGap,
                                        rowHeight
                                    )}
                                    compact={statusItems.length === 2}
                                >
                                    {item.value}
                                </StatusValue>
                            </Box>
                        );
                    })()
                )}
            </Box>
        </Box>
    );
}
