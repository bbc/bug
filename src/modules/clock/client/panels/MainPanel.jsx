import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import AnalogueClock from "../components/AnalogueClock";
import DateString from "../components/DateString";
import DigitalClock from "../components/DigitalClock";
const Clock = ({ type, ...props }) => {
    return type === "digital" ? <DigitalClock {...props} /> : <AnalogueClock {...props} />;
};

const MainPanel = () => {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const clocks = [
        { size: "xs", display: { xs: "block", sm: "none" } },
        { size: "sm", display: { xs: "none", sm: "block", md: "none" } },
        { size: "md", display: { xs: "none", sm: "none", md: "block", lg: "none" } },
        { size: "lg", display: { xs: "none", md: "none", lg: "block", xl: "none" } },
        { size: "xl", display: { xs: "none", lg: "none", xl: "block" } },
    ];

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
            {clocks.map((c) => (
                <Box key={c.size} sx={{ display: c.display }}>
                    <Clock type={panelConfig.data.type} size={c.size} />
                </Box>
            ))}
            <DateString />
        </Box>
    );
};

export default MainPanel;
