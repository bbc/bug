import BugPowerIcon from "@core/BugPowerIcon";
import { Box, CircularProgress } from "@mui/material";
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
