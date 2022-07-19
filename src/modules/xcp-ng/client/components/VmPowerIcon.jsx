import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import BugPowerIcon from "@core/BugPowerIcon";

export default function PanelPowerIcon({ item }) {
    return Object.keys(item.current_operations).length > 0 ? (
        <Box sx={{ textAlign: "center", marginTop: "2px" }}>
            <CircularProgress size={24} />
        </Box>
    ) : (
        <Box sx={{ textAlign: "center" }}>
            <BugPowerIcon disabled={item.power_state !== "Running"} />
        </Box>
    );
}
