import { Grid } from "@mui/material";
import TrafficChart from "./TrafficChart";

export default function NetworkTab({ panelId, deviceId }) {
    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TrafficChart deviceId={deviceId} panelId={panelId} type="area" />
            </Grid>
        </>
    );
}
