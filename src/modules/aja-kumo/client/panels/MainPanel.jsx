import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useState } from "react";

export default function MainPanel({ panelId }) {
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const sendAlert = useAlert();
    const router = useApiPoller({
        url: `/container/${panelId}/router`,
        interval: 3000,
        forceRefresh: refresh,
    });

    if (!router.data && router.status !== "failure") {
        return <BugLoading />;
    }

    if (router.status === "failure") {
        return <Alert severity="error">Unable to read the AJA KUMO router: {router.error}</Alert>;
    }

    const routeSource = async (sourceIndex) => {
        if (selectedDestination === null) {
            return;
        }
        const result = await AxiosCommand(`/container/${panelId}/route/${selectedDestination}/${sourceIndex}`);
        if (result) {
            setSelectedDestination(null);
            setRefresh((value) => value + 1);
        } else {
            sendAlert("Failed to route the AJA KUMO destination", { variant: "error" });
        }
    };

    return (
        <Grid container spacing={2} sx={{ height: "100%", p: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Destinations
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 1 }}>
                    {router.data.destinations.map((destination) => (
                        <Button
                            key={destination.index}
                            variant={selectedDestination === destination.index ? "contained" : "outlined"}
                            onClick={() => setSelectedDestination(destination.index)}
                            aria-pressed={selectedDestination === destination.index}
                            sx={{ minHeight: 72, display: "block", textTransform: "none" }}
                        >
                            <Typography variant="body2" noWrap>
                                {destination.index + 1}. {destination.label}
                            </Typography>
                            <Typography variant="caption" noWrap>
                                {destination.inputLabel}
                            </Typography>
                        </Button>
                    ))}
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Sources{selectedDestination === null ? "" : ` — select for destination ${selectedDestination + 1}`}
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 1 }}>
                    {router.data.sources.map((source) => {
                        const isRouted = router.data.destinations.some(
                            (destination) =>
                                destination.index === selectedDestination && destination.inputIndex === source.index
                        );
                        return (
                            <Button
                                key={source.index}
                                variant={isRouted ? "contained" : "outlined"}
                                disabled={selectedDestination === null}
                                onClick={() => routeSource(source.index)}
                                sx={{ minHeight: 56, textTransform: "none" }}
                            >
                                {source.index + 1}. {source.label}
                            </Button>
                        );
                    })}
                </Box>
            </Grid>
        </Grid>
    );
}
