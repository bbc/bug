import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

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
