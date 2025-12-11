import BugLoading from "@core/BugLoading";
import BugScrollbars from "@core/BugScrollbars";
import { useApiPoller } from "@hooks/ApiPoller";
import { useForceRefresh } from "@hooks/ForceRefresh";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useSelector } from "react-redux";
import GroupButtons from "./GroupButtons";
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

export default function Router({ panelId, editMode = false, transmitterGroup = 0, receiverGroup = 0 }) {
    const sendAlert = useAlert();
    const [selectedReceiver, setSelectedReceiver] = React.useState(null);
    const [transmitterForceRefresh, setTransmitterForceRefresh] = useForceRefresh();
    const [receiverForceRefresh, setReceiverForceRefresh] = useForceRefresh();
    const panelConfig = useSelector((state) => state.panelConfig);
    const useDoubleClick = panelConfig && panelConfig.data.useTake;

    const transmitterButtons = useApiPoller({
        url: `/container/${panelId}/transmitters/${
            selectedReceiver === null ? -1 : selectedReceiver
        }/${transmitterGroup}`,
        interval: editMode ? 5000 : 500,
        forceRefresh: transmitterForceRefresh,
    });

    const receiverButtons = useApiPoller({
        url: `/container/${panelId}/receivers/${receiverGroup}`,
        interval: 5000,
        forceRefresh: receiverForceRefresh,
    });

    const handleReceiverButtonClicked = (receiverIndex) => {
        if (editMode) {
            return;
        }
        setSelectedReceiver(receiverIndex);
    };

    const handleTransmitterButtonClicked = async (transmitterId) => {
        if (editMode) {
            return;
        }

        let transmitter = transmitterButtons.data.transmitters.filter((x) => x.id === transmitterId);
        let receiver = receiverButtons.data.receivers.filter((x) => x.id === selectedReceiver);

        if (transmitter.length !== 1 || receiver.length !== 1) {
            return;
        }

        if (await AxiosCommand(`/container/${panelId}/route/${selectedReceiver}/${transmitterId}`)) {
            sendAlert(`Successfully routed '${transmitter[0].label}' to '${receiver[0].label}'`, {
                broadcast: "true",
                variant: "success",
            });
            // force a refresh of the receivers
            setReceiverForceRefresh();
            return;
        }
        sendAlert(`Failed to route '${transmitter[0].label}' to '${receiver[0].label}'`, { variant: "error" });
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
                    <GroupButtons {...props} />
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

    const renderTransmitters = () => {
        if (
            transmitterButtons.status === "loading" ||
            transmitterButtons.status === "idle" ||
            !transmitterButtons.data
        ) {
            return <BugLoading />;
        }

        let receiverLocked = false;
        if (receiverButtons.status === "success" && selectedReceiver !== null) {
            const selectedReceiverObject = receiverButtons.data.receivers.find((x) => x.id === selectedReceiver);
            receiverLocked = selectedReceiverObject && selectedReceiverObject.isLocked;
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
                <SectionHeader>Transmitters</SectionHeader>

                {scrollableGroupButtons({
                    panelId: panelId,
                    editMode: editMode,
                    groupType: "transmitter",
                    selectedReceiver: selectedReceiver,
                    transmitterGroup: transmitterGroup,
                    receiverGroup: receiverGroup,
                    buttons: transmitterButtons,
                    onChange: () => setTransmitterForceRefresh(),
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
                            buttonType="transmitter"
                            selectedReceiver={selectedReceiver}
                            buttons={transmitterButtons}
                            onClick={handleTransmitterButtonClicked}
                            useDoubleClick={useDoubleClick}
                            onChange={() => setTransmitterForceRefresh()}
                            disabled={receiverLocked}
                        />
                    </BugScrollbars>
                </Box>
            </Box>
        );
    };

    const renderReceivers = () => {
        if (receiverButtons.status === "loading" || receiverButtons.status === "idle" || !receiverButtons.data) {
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
                <SectionHeader>Receivers</SectionHeader>
                {scrollableGroupButtons({
                    panelId: panelId,
                    editMode: editMode,
                    transmitterGroup: transmitterGroup,
                    receiverGroup: receiverGroup,
                    groupType: "receiver",
                    buttons: receiverButtons,
                    onChange: () => setTransmitterForceRefresh(),
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
                            buttonType="receiver"
                            selectedReceiver={selectedReceiver}
                            buttons={receiverButtons}
                            onClick={handleReceiverButtonClicked}
                            onChange={() => setReceiverForceRefresh()}
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
                    {renderTransmitters()}
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
                    {renderReceivers()}
                </Box>
            </Box>
        </>
    );
}
