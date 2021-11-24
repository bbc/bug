import React from "react";
import Weather from "../components/Weather";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";

export default function MainPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Weather {...panelConfig?.data} />
        </Box>
    );
}
