import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

export default function PanelRestarting() {
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
            <h3>Panel is restarting ...</h3>
            <Grid item size={{ xs: 3 }}>
                <Box position="relative" display="inline-flex">
                    <Box
                        sx={{
                            display: { xs: "none", sm: "inline-flex" },
                        }}
                    >
                        <CircularProgress size="12rem" />
                    </Box>

                    <Box
                        sx={{
                            display: { xs: "inline-flex", sm: "none" },
                        }}
                    >
                        <CircularProgress size="6rem" />
                    </Box>

                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    ></Box>
                </Box>
            </Grid>
        </Grid>
    );
}
