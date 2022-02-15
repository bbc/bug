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

export default function TabLayout({ panelId }) {
    const sendAlert = useAlert();

    const layout = useApiPoller({
        url: `/container/${panelId}/layout`,
        interval: 5000,
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
            // setDestinationForceRefreshHash(destinationForceRefreshHash + 1);
        } else {
            sendAlert(`Failed to change source for output ${outputIndex + 1}`, { variant: "error" });
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

    console.log(layout.data);

    if (layout.data && sources.data) {
        return (
            <>
                <Grid container spacing={1} sx={{ backgroundColor: "background.default", paddingTop: "2px" }}>
                    {layout.data.map((row, rowIndex) => (
                        <>
                            {row.map((col, colIndex) => {
                                console.log(col);
                                return (
                                    <Grid item key={`${colIndex}-${rowIndex}`} xs={12 / layout.data.length}>
                                        <Box sx={{ padding: "16px", backgroundColor: "background.paper" }}>
                                            <BugApiSelect
                                                value={col.inputIndex}
                                                items={sources.data}
                                                onChange={(event) =>
                                                    // javascript object keys can only be strings, so we have to convert to int here. Grrrr.
                                                    handleSourceChange(col.outputIndex, parseInt(event.target.value))
                                                }
                                                renderItem={(item, key) => (
                                                    <>
                                                        <span style={{ fontWeight: 600, marginRight: "0.5rem" }}>
                                                            {parseInt(key) + 1}
                                                        </span>
                                                        {item}
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
                                                    // onClick={() => handleAudioClick}
                                                >
                                                    Audio
                                                </Button>
                                                <Button
                                                    color={col.soloSelected ? "primary" : "secondary"}
                                                    variant="contained"
                                                    sx={{ margin: "16px 0 0 8px" }}
                                                    // onClick={handleAudioClick}
                                                >
                                                    Solo
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </>
                    ))}
                </Grid>
            </>
        );
    }
    return <BugNoData title="No current data found" showConfigButton={true} />;
}
