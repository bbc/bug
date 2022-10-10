import React from "react";
import BugApiButton from "@core/BugApiButton";
import BugDetailsTable from "@core/BugDetailsTable";
import BugTextField from "@core/BugTextField";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import StateLabel from "./StateLabel";
import Box from "@mui/material/Box";

export default function GroupRx({ connection, panelId, showAdvanced }) {
    const sendAlert = useAlert();

    const handleDisconnect = async (connection) => {
        const url = `/container/${panelId}/connection/disconnect/${encodeURIComponent(connection.id)}`;
        sendAlert(`Requested disconnection`, { variant: "info" });
        await AxiosCommand(url);
    };

    return (
        <>
            <BugDetailsTable
                sx={{
                    "& .MuiTableCell-root": {
                        height: "66px",
                    },
                }}
                width="8rem"
                items={[
                    {
                        name: "Status",
                        value: (
                            <StateLabel
                                state={connection.state}
                                txValue={connection.remoteLinkQuality}
                                rxValue={connection.localLinkQuality}
                            />
                        ),
                    },
                    {
                        name: "Address",
                        value: (
                            <BugTextField
                                fullWidth
                                value={connection?._destination}
                                type="text"
                                variant="outlined"
                                disabled={true}
                            />
                        ),
                    },
                    {
                        name: "Audio Port",
                        value: (
                            <BugTextField
                                fullWidth
                                value={connection.audioPort}
                                type="text"
                                variant="outlined"
                                disabled={true}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Session Port",
                        value: (
                            <BugTextField
                                fullWidth
                                value={connection.sessionPort}
                                type="text"
                                variant="outlined"
                                disabled={true}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "",
                        value: "",
                    },
                ]}
            />
            <Box
                sx={{
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <BugApiButton
                    sx={{
                        marginLeft: "0.5rem",
                    }}
                    onClick={(e) => handleDisconnect(connection)}
                    variant="contained"
                    color="primary"
                    disabled={!connection._connected && !connection._connecting}
                >
                    Disconnect
                </BugApiButton>
            </Box>
        </>
    );
}
