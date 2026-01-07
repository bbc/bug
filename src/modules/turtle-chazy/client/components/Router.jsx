import BugLoading from "@core/BugLoading";
import BugScrollbars from "@core/BugScrollbars";
import { useApiPoller } from "@hooks/ApiPoller";
import { useForceRefresh } from "@hooks/ForceRefresh";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useSelector } from "react-redux";
import DeviceButtons from "./DeviceButtons";
import RouterButtons from "./RouterButtons";
const SectionHeader = styled("div")(({ theme }) => ({
    fontSize: "0.875rem",
    fontWeight: 500,
    textTransform: "uppercase",
    padding: "12px",
    backgroundColor: "#212121",
    [theme.breakpoints.down(800)]: {
        fontSize: "12px",
        backgroundColor: "inherit",
        padding: "6px 6px 2px 6px",
    },
}));

export default function Router({ panelId, editMode = false, sourceGroup = "-", destinationGroup = "-" }) {
    const sendAlert = useAlert();
    const [selectedDestinationIndex, setSelectedDestinationIndex] = React.useState(null);
    const [sourceForceRefresh, setSourceForceRefresh] = useForceRefresh();
    const [destinationForceRefresh, setDestinationForceRefresh] = useForceRefresh();
    const panelConfig = useSelector((state) => state.panelConfig);
    const useDoubleClick = panelConfig && panelConfig.data.useTake;

    const sourceButtons = useApiPoller({
        url: `/container/${panelId}/sources/`,
        postData: {
            sourceDevice: sourceGroup,
            destinationDevice: destinationGroup,
            destinationIndex: selectedDestinationIndex,
        },
        interval: editMode ? 5000 : 2000,
        forceRefresh: sourceForceRefresh,
    });

    const destinationButtons = useApiPoller({
        url: `/container/${panelId}/destinations/${destinationGroup ?? "-"}`,
        interval: 5000,
        forceRefresh: destinationForceRefresh,
    });

    const handleDestinationButtonClicked = (destinationIndex) => {
        if (editMode) {
            return;
        }
        setSelectedDestinationIndex(destinationIndex);
    };

    const handleSourceButtonClicked = async (sourceLabel) => {
        if (editMode) {
            return;
        }

        let source = sourceButtons.data.sources.find((x) => x.label === sourceLabel);
        let destination = destinationButtons.data.destinations.find((x) => x.index === selectedDestinationIndex);

        if (!source || !destination) {
            return;
        }

        const url = `/container/${panelId}/route/${encodeURIComponent(destinationGroup)}/${encodeURIComponent(
            destination.index
        )}/${encodeURIComponent(sourceGroup)}/${source.index}`;
        if (await AxiosCommand(url)) {
            sendAlert(`Successfully routed '${source.label}' to '${destination.label}'`, {
                broadcast: "true",
                variant: "success",
            });
            // force a refresh of the destinations
            setDestinationForceRefresh();
            return;
        }
        sendAlert(`Failed to route '${source.label}' to '${destination.label}'`, { variant: "error" });
    };

    const scrollableGroupButtons = (props) => {
        if (props?.buttons?.data?.groups?.length === 0 && !editMode) {
            return false;
        }
        if (editMode) {
            return (
                <Box
                    sx={{
                        width: "100%",
                        padding: "8px 8px 0px 8px",
                        "@media (max-width:800px)": {
                            padding: "4px 4px 0px 4px",
                        },
                    }}
                >
                    <DeviceButtons {...props} />
                </Box>
            );
        }
        return (
            <Box
                sx={{
                    height: "72px",
                    width: "100%",
                    padding: "8px 8px 0px 8px",
                    "@media (max-width:800px)": {
                        padding: "4px 4px 0px 4px",
                        height: "54px",
                    },
                }}
            >
                <BugScrollbars>
                    <DeviceButtons {...props} />
                </BugScrollbars>
            </Box>
        );
    };

    const renderSources = () => {
        if (sourceButtons.status === "loading" || sourceButtons.status === "idle" || !sourceButtons.data) {
            return <BugLoading />;
        }

        // let destinationLocked = false;
        // if (destinationButtons.status === "success" && selectedDestination !== null) {
        //     const selectedDestinationObject = destinationButtons.data.destinations.find(
        //         (x) => x.index === selectedDestination
        //     );
        //     destinationLocked = selectedDestinationObject && selectedDestinationObject.isLocked;
        // }

        return (
            <Box
                sx={{
                    backgroundColor: "#262626",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <SectionHeader>Sources</SectionHeader>

                {scrollableGroupButtons({
                    panelId: panelId,
                    editMode: editMode,
                    groupType: "source",
                    selectedDestinationIndex: selectedDestinationIndex,
                    sourceGroup: sourceGroup,
                    destinationGroup: destinationGroup,
                    buttons: sourceButtons,
                    onChange: () => setSourceForceRefresh(),
                })}

                <Box
                    sx={{
                        width: "100%",
                        flexGrow: 1,
                    }}
                >
                    <BugScrollbars>
                        <RouterButtons
                            panelId={panelId}
                            editMode={editMode}
                            buttonType="source"
                            selectedDestinationIndex={selectedDestinationIndex}
                            buttons={sourceButtons}
                            onClick={handleSourceButtonClicked}
                            useDoubleClick={useDoubleClick}
                            onChange={() => setSourceForceRefresh()}
                            // disabled={destinationLocked}
                        />
                    </BugScrollbars>
                </Box>
            </Box>
        );
    };

    const renderDestinations = () => {
        if (
            destinationButtons.status === "loading" ||
            destinationButtons.status === "idle" ||
            !destinationButtons.data
        ) {
            return <BugLoading />;
        }

        return (
            <Box
                sx={{
                    backgroundColor: "#262626",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <SectionHeader>Destinations</SectionHeader>

                {scrollableGroupButtons({
                    panelId: panelId,
                    editMode: editMode,
                    groupType: "destination",
                    sourceGroup: sourceGroup,
                    destinationGroup: destinationGroup,
                    buttons: destinationButtons,
                    onChange: () => setDestinationForceRefresh(),
                })}

                <Box
                    sx={{
                        width: "100%",
                        flexGrow: 1,
                    }}
                >
                    <BugScrollbars>
                        <RouterButtons
                            panelId={panelId}
                            editMode={editMode}
                            buttonType="destination"
                            selectedDestinationIndex={selectedDestinationIndex}
                            buttons={destinationButtons}
                            onClick={handleDestinationButtonClicked}
                            onChange={() => setDestinationForceRefresh()}
                        />
                    </BugScrollbars>
                </Box>
            </Box>
        );
    };

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        right: "0px",
                        bottom: "50%",
                        marginBottom: "2px",
                    }}
                >
                    {renderSources()}
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: "50%",
                        marginTop: "2px",
                    }}
                >
                    {renderDestinations()}
                </Box>
            </Box>
        </>
    );
}
