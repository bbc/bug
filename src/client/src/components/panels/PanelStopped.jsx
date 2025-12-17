import { Grid } from "@mui/material";

export default function PanelStopped(props) {
    return (
        <Grid
            container
            spacing={0}
            sx={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h3>Panel is not running</h3>
        </Grid>
    );
}
