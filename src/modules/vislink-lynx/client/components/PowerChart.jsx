import BugPowerChart from "@core/BugPowerChart";
import { Grid } from "@mui/material";

export default function TrafficChart({ receiverCount = 4, panelId, type = "power" }) {
    return (
        <>
            <Grid
                size={{ xs: 12 }}
                sx={{
                    padding: "2rem 1rem 1rem 1rem",
                    minHeight: "400px",
                    "@media (max-height:650px)": {
                        padding: "2rem",
                    },
                }}
            >
                <BugPowerChart
                    yRange={[-90, 0]}
                    receiverCount={receiverCount}
                    url={`/container/${panelId}/receiver/${type}`}
                />
            </Grid>
        </>
    );
}
