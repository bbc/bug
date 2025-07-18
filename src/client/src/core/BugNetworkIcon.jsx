import { Box } from "@mui/material";
import { Lan } from "mdi-material-ui";

export default function BugNetworkIcon({ disabled = false, sx = {}, activeColor = "primary.main" }) {
    return (
        <Box
            sx={{
                color: disabled ? "#ffffff" : activeColor,
                opacity: disabled ? 0.1 : 1,
                display: "block",
                margin: "auto",
                ...sx,
            }}
        >
            <Lan />
        </Box>
    );
}
