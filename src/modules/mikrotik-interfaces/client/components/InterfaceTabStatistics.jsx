import BugTrafficChart from "@core/BugTrafficChart";
import { Grid } from "@mui/material";

export default function InterfaceTabStatistics({ panelId, interfaceName }) {
    return (
        <>
            <Grid
                size={{ xs: 12 }}
                sx={{
                    padding: "2rem 1rem 1rem 1rem",
                    minHeight: "400px",
                    "@media (max-height:650px)": {
                        padding: "1rem",
                    },
                }}
            >
                <BugTrafficChart url={`/container/${panelId}/interface/history/${interfaceName}`} />
            </Grid>
        </>
    );
}
