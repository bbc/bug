import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import DelayChart from "../components/DelayChart";
import LossChart from "../components/LossChart";
import Statistics from "../components/Statistics";

export default function TabStatistics() {
    const theme = useTheme();
    const params = useParams();
    const isXLView = useMediaQuery(theme.breakpoints.up("xl"));

    return (
        <Grid container spacing={1}>
            <Grid
                item
                size={{ xs: 12, lg: 12, xl: 5 }}
                sx={{
                    borderRightWidth: isXLView ? "4px" : "0px",
                    borderRightStyle: "solid",
                    borderRightColor: "border.light",
                }}
            >
                <Statistics panelId={params.panelId} />
            </Grid>
            <Grid item size={{ xs: 12, lg: 12, xl: 7 }}>
                <Grid container spacing={1} sx={{ marginBottom: "8px" }}>
                    <Grid item size={{ xs: 12 }}>
                        <DelayChart panelId={params.panelId} />
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                        <LossChart panelId={params.panelId} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
