import { Box } from "@mui/material";
import stateColor from "./stateColor";
export default function StateLabel({ state, txValue, rxValue, showValues = true }) {
    const color = stateColor({ state, txValue, txValue });

    return (
        <Box
            sx={{
                textTransform: "uppercase",
                opacity: 0.8,
                fontWeight: 500,
                display: "flex",
                color: "secondary.main",
            }}
        >
            <Box sx={{ color: color }}>{state}</Box>
            {showValues && (
                <>
                    {state === "Connected" && (
                        <Box sx={{ paddingLeft: "16px", display: "flex" }}>
                            TX:
                            <Box sx={{ color: color, marginLeft: "4px" }}>{txValue}%</Box>
                        </Box>
                    )}
                </>
            )}
            {showValues && (
                <>
                    {state === "Connected" && (
                        <Box sx={{ paddingLeft: "8px", display: "flex" }}>
                            RX:
                            <Box sx={{ color: color, marginLeft: "4px" }}>{rxValue}%</Box>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}
