import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { memo } from "react";
import { Textfit } from "react-textfit";

export default function BugStatusBlock({ items, label, state, sx = {}, image }) {
    const stateColors = {
        success: "#05990c",
        warning: "#d07111",
        error: "#b52424",
        info: "#337ab7",
        inactive: "#262626",
    };

    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("lg"));

    // Memoized Textfit to prevent unnecessary recalculation
    const MemoTextfit = memo(({ children }) => (
        <Textfit
            mode="multi"
            min={10}
            max={1000}
            forceSingleModeWidth={false}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "500",
                fontFamily: "Fira Code",
            }}
        >
            {children}
        </Textfit>
    ));

    if (image) {
        return (
            <Box
                sx={{
                    marginTop: "32px",
                    padding: "4px",
                    display: "inline-block",
                    verticalAlign: "top",
                    ...sx,
                }}
            >
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
                    justifyContent: "center",
                    padding: "8px",
                    gap: "4px",
                    overflow: "hidden",
                    boxSizing: "border-box",
                }}
            >
                {items &&
                    items.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: 1,
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MemoTextfit>{item}</MemoTextfit>
                        </Box>
                    ))}
            </Box>
        </Box>
    );
}
