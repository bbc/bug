import React from "react";
import BugApiButton from "@core/BugApiButton";
import BugDetailsTable from "@core/BugDetailsTable";
import BugTextField from "@core/BugTextField";
import BugCodecAutocomplete from "@core/BugCodecAutocomplete";
import BugApiSelect from "@core/BugApiSelect";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import StateLabel from "./StateLabel";
import Box from "@mui/material/Box";

export default function GroupTx({ panelConfig, connection, group, panelId, onChange, showAdvanced }) {
    const sendAlert = useAlert();

    const handleConnect = async (connection) => {
        const url = `/container/${panelId}/connection/connect/${encodeURIComponent(connection.id)}`;
        sendAlert(`Requested connection`, { variant: "info" });
        await AxiosCommand(url);
    };

    const handleDisconnect = async (connection) => {
        const url = `/container/${panelId}/connection/disconnect/${encodeURIComponent(connection.id)}`;
        sendAlert(`Requested disconnection`, { variant: "info" });
        await AxiosCommand(url);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
            }}
        >
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
                    panelConfig.data.codecSource && {
                        name: "Destination",
                        value: (
                            <BugCodecAutocomplete
                                addressValue={connection.destination}
                                portValue={connection.audioPort}
                                apiUrl={`/container/${panelId}/codecdb`}
                                capability="tieline"
                                onChange={(e, codec) => {
                                    console.log("change", codec.address, codec.port);
                                    onChange(group.id, connection.id, {
                                        destination: codec.address,
                                        audioPort: codec.port,
                                    });
                                }}
                                disabled={connection._connected || connection._connecting}
                            />
                        ),
                    },
                    {
                        name: "Address",
                        value: (
                            <BugTextField
                                fullWidth
                                value={connection.destination}
                                onChange={(e) => onChange(group.id, connection.id, { destination: e.target.value })}
                                type="text"
                                variant="outlined"
                                changeOnBlur
                                disabled={connection._connected || connection._connecting}
                            />
                        ),
                    },
                    {
                        name: "Audio Port",
                        value: (
                            <BugTextField
                                fullWidth
                                value={connection.audioPort}
                                onChange={(e) => onChange(group.id, connection.id, { audioPort: e.target.value })}
                                type="text"
                                variant="outlined"
                                filter={/[^0-9]/}
                                numeric
                                min={10}
                                max={10000}
                                changeOnBlur
                                disabled={connection._connected || connection._connecting}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Session Port",
                        value: (
                            <BugTextField
                                fullWidth
                                value={connection.sessionPort}
                                onChange={(e) => onChange(group.id, connection.id, { sessionPort: e.target.value })}
                                type="text"
                                variant="outlined"
                                filter={/[^0-9]/}
                                numeric
                                min={10}
                                max={10000}
                                changeOnBlur
                                disabled={connection._connected || connection._connecting}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Interface",
                        value: (
                            <BugApiSelect
                                value={connection.via}
                                options={[
                                    { id: "Any", label: "Any" },
                                    { id: "Primary", label: "Primary" },
                                    { id: "Secondary", label: "Secondary" },
                                    { id: "Tertiary", label: "Tertiary" },
                                    { id: "ETH1", label: "ETH1" },
                                    { id: "ETH2", label: "ETH2" },
                                    { id: "Wi-Fi", label: "Wi-Fi" },
                                    { id: "Fuse-IP", label: "Fuse-IP" },
                                    { id: "VLAN1", label: "VLAN1" },
                                    { id: "VLAN2", label: "VLAN2" },
                                    { id: "VLAN3", label: "VLAN3" },
                                    { id: "VLAN4", label: "VLAN4" },
                                ]}
                                variant="outlined"
                                onChange={(e) => onChange(group.id, connection.id, { via: e.target.value })}
                                disabled={connection._connected || connection._connecting}
                            />
                        ),
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
                    onClick={(e) => handleConnect(connection)}
                    variant="contained"
                    color="primary"
                    disabled={connection._connected || connection._connecting}
                >
                    Connect
                </BugApiButton>
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
        </Box>
    );
}
