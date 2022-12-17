import React from "react";
import VideoPlayer from "../components/VideoPlayer";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";

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
