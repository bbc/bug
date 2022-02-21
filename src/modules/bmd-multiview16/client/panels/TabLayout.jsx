import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugApiSelect from "@core/BugApiSelect";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useForceRefresh } from "@hooks/ForceRefresh";

export default function TabLayout({ panelId }) {
    const sendAlert = useAlert();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const layout = useApiPoller({
        url: `/container/${panelId}/layout`,
        interval: 5000,
        forceRefresh: forceRefresh,
    });

    const sources = useApiPoller({
        url: `/container/${panelId}/source`,
        interval: 5000,
    });

    const handleSourceChange = async (outputIndex, inputIndex) => {
        if (await AxiosCommand(`/container/${panelId}/destination/${outputIndex}/${inputIndex}`)) {
            sendAlert(`Successfully changed source for output ${outputIndex + 1}`, {
                broadcast: true,
                variant: "success",
            });
            // force a refresh of the destinations
            doForceRefresh();
        } else {
            sendAlert(`Failed to change source for output ${outputIndex + 1}`, { variant: "error" });
        }
    };

    const handleAudioChange = async (inputIndex) => {
        if (await AxiosCommand(`/container/${panelId}/destination/setaudio/${inputIndex}`)) {
            sendAlert(`Successfully selected audio source ${inputIndex + 1}`, {
                broadcast: true,
                variant: "success",
            });
            // force a refresh of the layout
            doForceRefresh();
        } else {
            sendAlert(`Failed to change audio source to input ${inputIndex + 1}`, { variant: "error" });
        }
    };

    const handleSoloChange = async (inputIndex, enableSolo) => {
        if (enableSolo) {
            if (await AxiosCommand(`/container/${panelId}/source/setsolo/${inputIndex}`)) {
                sendAlert(`Successfully selected solo source ${inputIndex + 1}`, {
                    broadcast: true,
                    variant: "success",
                });
                // force a refresh of the layout
                doForceRefresh();
            } else {
                sendAlert(`Failed to change solo source to input ${inputIndex + 1}`, { variant: "error" });
            }
        } else {
            if (await AxiosCommand(`/container/${panelId}/source/clearsolo`)) {
                sendAlert(`Successfully unselected solo source`, {
                    broadcast: true,
                    variant: "success",
                });
                // force a refresh of the layout
                doForceRefresh();
            } else {
                sendAlert(`Failed to unselect solo source`, { variant: "error" });
            }
        }
    };

    if (
        layout.status === "idle" ||
        layout.status === "loading" ||
        sources.status === "idle" ||
        sources.status === "loading"
    ) {
        return <BugLoading height="30vh" />;
    }

    if (layout.data && sources.data) {
        const sourcesArray = sources.data.map((source, index) => ({
            id: index,
            label: source,
        }));

        return (
            <>
                <Grid container spacing={1} sx={{ backgroundColor: "background.default", paddingTop: "2px" }}>
                    {layout.data.map((row, rowIndex) => {
                        return row.map((col, colIndex) => {
                            return (
                                <Grid item key={`${colIndex}-${rowIndex}`} xs={12 / layout.data.length}>
                                    <Box sx={{ padding: "16px", backgroundColor: "background.paper" }}>
                                        <BugApiSelect
                                            value={col.inputIndex}
                                            options={sourcesArray}
                                            onChange={(event) =>
                                                handleSourceChange(col.outputIndex, event.target.value)
                                            }
                                            renderItem={(item) => (
                                                <>
                                                    <span style={{ fontWeight: 600, marginRight: "0.5rem" }}>
                                                        {item.id + 1}
                                                    </span>
                                                    {item.label}
                                                </>
                                            )}
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Button
                                                color={col.audioSelected ? "primary" : "secondary"}
                                                variant="contained"
                                                sx={{ margin: "16px 8px 0 0" }}
                                                onClick={() => handleAudioChange(col.inputIndex)}
                                            >
                                                Audio
                                            </Button>
                                            <Button
                                                color={col.soloSelected ? "primary" : "secondary"}
                                                variant="contained"
                                                sx={{ margin: "16px 0 0 8px" }}
                                                onClick={() => handleSoloChange(col.inputIndex, !col.soloSelected)}
                                            >
                                                Solo
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            );
                        });
                    })}
                </Grid>
            </>
        );
    }
    return <BugNoData title="No current data found" showConfigButton={true} />;
}
