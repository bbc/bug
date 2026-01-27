import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import AnalogueClock from "../components/AnalogueClock";
import DateString from "../components/DateString";
import DigitalClock from "../components/DigitalClock";

const MainPanel = () => {
    const panelConfig = useSelector((state) => state.panelConfig);
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));

    const activeSize = isXs ? "xs" : isSm ? "sm" : isMd ? "md" : isLg ? "lg" : "xl";

    if (panelConfig.status === "loading") return <BugLoading />;
    if (panelConfig.status !== "success") return null;

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                minWidth: "200px",
                padding: 2,
                textAlign: "center",
                color: "text.secondary",
            }}
        >
            {panelConfig.data.type === "digital" ? (
                <DigitalClock size={activeSize} />
            ) : (
                <AnalogueClock key="analogue" size={activeSize} />
            )}

            <DateString />
        </Box>
    );
};
export default MainPanel;
