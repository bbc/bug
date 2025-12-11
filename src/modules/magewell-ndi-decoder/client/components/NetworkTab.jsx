import Grid from "@mui/material/Grid";
import TrafficChart from "./TrafficChart";

export default function NetworkTab({ panelId }) {
    return (
        <>
            <Grid item size={{ xs: 12 }}>
                <TrafficChart panelId={panelId} type="area" />
            </Grid>
        </>
    );
}
