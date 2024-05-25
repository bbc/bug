import React from "react";
import BugLoading from "@core/BugLoading";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useApiPoller } from "@hooks/ApiPoller";
import GroupButtons from "./GroupButtons";
import RouterButtons from "./RouterButtons";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import BugScrollbars from "@core/BugScrollbars";
import { useForceRefresh } from "@hooks/ForceRefresh";
import BugNoData from "@core/BugNoData";

const SectionHeader = styled("div")({
    fontSize: "0.875rem",
    fontWeight: 500,
    textTransform: "uppercase",
    padding: "12px",
    backgroundColor: "#212121",
    "@media (max-width:800px)": {
        fontSize: "12px",
        backgroundColor: "inherit",
        padding: "6px 6px 2px 6px",
    },
});

export default function Router({ panelId, editMode = false, sourceGroup = 0, destinationGroup = 0 }) {
    const sendAlert = useAlert();
    const [selectedDestination, setSelectedDestination] = React.useState(null);
    const [sourceForceRefresh, setSourceForceRefresh] = useForceRefresh();
    const [destinationForceRefresh, setDestinationForceRefresh] = useForceRefresh();
    const panelConfig = useSelector((state) => state.panelConfig);
    const useDoubleClick = panelConfig && panelConfig.data.useTake;

    const sourceButtons = useApiPoller({
        url: `/container/${panelId}/source/${selectedDestination === null ? -1 : selectedDestination}/${sourceGroup}`,
        interval: editMode ? 5000 : 500,
        forceRefresh: sourceForceRefresh,
    });

    const destinationButtons = useApiPoller({
        url: `/container/${panelId}/destination/${destinationGroup}`,
        interval: 5000,
        forceRefresh: destinationForceRefresh,
    });

    // get the 'fixed' values for the currently selected grouos]
    const sourceFixed = sourceButtons?.data?.groups[sourceGroup]?.fixed;
    const destinationFixed = destinationButtons?.data?.groups[destinationGroup]?.fixed;

    const handleDestinationButtonClicked = (destinationIndex) => {
        if (editMode) {
            return;
        }
        setSelectedDestination(destinationIndex);
    };

    const handleSourceButtonClicked = async (sourceIndex) => {
        if (editMode) {
            return;
        }

        let source = sourceButtons.data.sources.filter((x) => x.index === sourceIndex);
        let destination = destinationButtons.data.destinations.filter((x) => x.index === selectedDestination);

        if (source.length !== 1 || destination.length !== 1) {
            return;
        }

        if (await AxiosCommand(`/container/${panelId}/destination/route/${selectedDestination}/${sourceIndex}`)) {
            sendAlert(`Successfully routed '${source[0].label}' to '${destination[0].label}'`, {
                broadcast: "true",
                variant: "success",
            });
            // force a refresh of the destinations
            setDestinationForceRefresh();
            return;
        }
        sendAlert(`Failed to route '${source[0].label}' to '${destination[0].label}'`, { variant: "error" });
    };

    const scrollableGroupButtons = (props) => {
        if (props?.buttons?.data?.groups?.length === 0 && !editMode) {
            return false;
        }
        if (editMode) {
            return (
                <Box
                    sx={{
                        height: "72px",
                        width: "100%",
                        padding: "8px 8px 0px 8px",
                        "@media (max-width:800px)": {
                            padding: "4px 4px 0px 4px",
                        },
                    }}
                >
                    <BugScrollbars>
                        <GroupButtons {...props} />
                    </BugScrollbars>
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
                    <GroupButtons {...props} />
                </BugScrollbars>
            </Box>
        );
    };

    const renderSources = () => {
        if (sourceButtons.status === "loading" || sourceButtons.status === "idle" || !sourceButtons.data) {
            return <BugLoading />;
        }

        let destinationLocked = false;
        if (destinationButtons.status === "success" && selectedDestination !== null) {
            const selectedDestinationObject = destinationButtons.data.destinations.find(
                (x) => x.index === selectedDestination
            );
            destinationLocked = selectedDestinationObject && selectedDestinationObject.isLocked;
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
                <SectionHeader>Sources</SectionHeader>

                {scrollableGroupButtons({
                    panelId: panelId,
                    editMode: editMode,
                    groupType: "source",
                    selectedDestination: selectedDestination,
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
                            selectedDestination={selectedDestination}
                            buttons={sourceButtons}
                            onClick={handleSourceButtonClicked}
                            useDoubleClick={useDoubleClick}
                            onChange={() => setSourceForceRefresh()}
                            disabled={destinationLocked}
                            fixed={sourceFixed}
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
                    sourceGroup: sourceGroup,
                    destinationGroup: destinationGroup,
                    groupType: "destination",
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
                            selectedDestination={selectedDestination}
                            buttons={destinationButtons}
                            onClick={handleDestinationButtonClicked}
                            onChange={() => setDestinationForceRefresh()}
                            fixed={destinationFixed}
                        />
                    </BugScrollbars>
                </Box>
            </Box>
        );
    };

    if (!sourceButtons?.data?.groups || !destinationButtons?.data?.groups) {
        return <BugNoData title="Device router data not found" showConfigButton={false} />;
    }

    return (
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
    );
}
