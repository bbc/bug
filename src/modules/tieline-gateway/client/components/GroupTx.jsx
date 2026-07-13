import BugApiButton from "@core/BugApiButton";
import BugApiSelect from "@core/BugApiSelect";
import BugCodecAutocomplete from "@core/BugCodecAutocomplete";
import BugDetailsTable from "@core/BugDetailsTable";
import BugTextField from "@core/BugTextField";
import { Box } from "@mui/material";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import StateLabel from "./StateLabel";

const parseCodecParams = (codec) => {
    const rawParams = codec?.params;
    if (!rawParams) {
        return {};
    }

    if (typeof rawParams !== "string") {
        return rawParams;
    }

    try {
        return JSON.parse(rawParams);
    } catch {
        return {};
    }
};

const getCodecSessionRange = (codec) => {
    const basePort = parseInt(codec?.port, 10);
    if (Number.isNaN(basePort)) {
        return null;
    }

    const params = parseCodecParams(codec);
    const maxSessionsValue =
        params.max_sessions ?? params.maxSessions ?? params.MAX_SESSIONS ?? codec?.max_sessions ?? codec?.maxSessions;
    const maxSessions = parseInt(maxSessionsValue, 10);
    const maxPort = Number.isNaN(maxSessions) ? basePort : basePort + maxSessions;

    return { basePort, maxPort };
};

export default function GroupTx({ panelConfig, connection, group, panelId, onChange, showAdvanced }) {
    const sendAlert = useAlert();
    const [selectedCodec, setSelectedCodec] = React.useState(null);

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

    const handleCalculateCodecValue = ({ options, addressValue, portValue }) => {
        const currentPort = parseInt(portValue, 10);

        if (Number.isNaN(currentPort)) {
            return null;
        }

        return options.find((item) => {
            if (item.address !== addressValue) {
                return false;
            }

            const sessionRange = getCodecSessionRange(item);
            if (!sessionRange) {
                return false;
            }

            return currentPort >= sessionRange.basePort && currentPort <= sessionRange.maxPort;
        });
    };

    const selectedSessionRange = getCodecSessionRange(selectedCodec);
    const audioPort = parseInt(connection?.audioPort, 10);
    const isAudioOffsetPort =
        !Number.isNaN(audioPort) &&
        selectedSessionRange &&
        audioPort >= selectedSessionRange.basePort &&
        audioPort <= selectedSessionRange.maxPort &&
        audioPort !== selectedSessionRange.basePort;

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
                                calculateValue={handleCalculateCodecValue}
                                addressValue={connection.destination}
                                portValue={connection.audioPort}
                                apiUrl={`/container/${panelId}/codecdb`}
                                capability="tieline"
                                onValueResolved={setSelectedCodec}
                                onChange={(e, codec) => {
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
                                value={connection.destination ? connection.destination : ""}
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
                                helperText={
                                    isAudioOffsetPort
                                        ? `Default audio port (${selectedSessionRange.basePort}) overridden`
                                        : ""
                                }
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
                                    { id: "Quaternary", label: "Quaternary" },
                                    { id: "LAN1", label: "LAN1" },
                                    { id: "LAN2", label: "LAN2" },
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
                    color="success"
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
                    color="error"
                    disabled={!connection._connected && !connection._connecting}
                >
                    Disconnect
                </BugApiButton>
            </Box>
        </Box>
    );
}
