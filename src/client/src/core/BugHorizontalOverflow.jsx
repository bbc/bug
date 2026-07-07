import { useHorizontalOverflowIndicators } from "@hooks/HorizontalOverflowIndicators";
import { Box } from "@mui/material";

export default function BugHorizontalOverflow({
    children,
    sx = {},
    viewportSx = {},
    contentSx = {},
    edgePadding = 8,
    fadeWidth = 24,
    showFades = true,
}) {
    const { scrollRef, canScrollLeft, canScrollRight, updateScrollState } = useHorizontalOverflowIndicators();

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                ...sx,
            }}
        >
            <Box
                ref={scrollRef}
                onScroll={updateScrollState}
                sx={{
                    overflowX: "auto",
                    overflowY: "hidden",
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,
                    paddingLeft: `${edgePadding}px`,
                    paddingRight: `${edgePadding}px`,
                    ...viewportSx,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        width: "max-content",
                        minWidth: "100%",
                        "& > *": {
                            flexShrink: 0,
                        },
                        ...contentSx,
                    }}
                >
                    {children}
                </Box>
            </Box>

            {showFades && canScrollLeft && (
                <Box
                    aria-hidden="true"
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: `${fadeWidth}px`,
                        pointerEvents: "none",
                        background: (theme) =>
                            `linear-gradient(to right, ${theme.palette.background.default} 0%, transparent 100%)`,
                    }}
                />
            )}

            {showFades && canScrollRight && (
                <Box
                    aria-hidden="true"
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 0,
                        width: `${fadeWidth}px`,
                        pointerEvents: "none",
                        background: (theme) =>
                            `linear-gradient(to left, ${theme.palette.background.default} 0%, transparent 100%)`,
                    }}
                />
            )}
        </Box>
    );
}
