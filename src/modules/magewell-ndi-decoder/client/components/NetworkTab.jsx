import { Grid } from "@mui/material";
import TrafficChart from "./TrafficChart";

export default function NetworkTab({ panelId }) {
    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TrafficChart panelId={panelId} type="area" />
            </Grid>
        </>
    );
}
