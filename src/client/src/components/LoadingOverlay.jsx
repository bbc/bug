import { Backdrop, CircularProgress, Grid } from "@mui/material";

export default function LoadingOverlay(props) {
    return (
        <Grid
            container
            spacing={0}
            sx={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
            }}
        >
            <Backdrop
                open={true}
                style={{
                    zIndex: 1261,
                    color: "#fff",
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Grid>
    );
}
