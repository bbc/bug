import BugTrafficChart from "@core/BugTrafficChart";
import Grid from "@mui/material/Grid";

export default function TrafficChart({ panelId }) {
    return (
        <>
            <Grid
                item
                size={{ xs: 12 }}
                sx={{
                    padding: "2rem 1rem 1rem 1rem",
                    minHeight: "400px",
                    "@media (max-height:650px)": {
                        padding: "1rem",
                    },
                }}
            >
                <BugTrafficChart type="area" url={`/container/${panelId}/network/history`} />
            </Grid>
        </>
    );
}
