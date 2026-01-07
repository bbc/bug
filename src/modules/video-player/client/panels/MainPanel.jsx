import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import VideoPlayer from "../components/VideoPlayer";
export default function MainPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <VideoPlayer {...panelConfig?.data} />
        </Box>
    );
}
