import { CircularProgress, Grid } from "@mui/material";

export default function BugLoading({ height = "100vh", sx = {} }) {
    return (
        <Grid
            container
            spacing={0}
            sx={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: height,
                ...sx,
            }}
        >
            <Grid size={{ xs: 3 }} sx={{ textAlign: "center" }}>
                <CircularProgress />
            </Grid>
        </Grid>
    );
}
