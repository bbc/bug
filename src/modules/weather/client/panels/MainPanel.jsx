import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import Weather from "../components/Weather";
export default function MainPanel({ panelId }) {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Weather panelId={panelId} {...panelConfig?.data} />
        </Box>
    );
}
