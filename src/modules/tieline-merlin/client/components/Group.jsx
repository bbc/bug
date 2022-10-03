import React from "react";
import BugCard from "@core/BugCard";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BugApiButton from "@core/BugApiButton";
import BugDetailsTable from "@core/BugDetailsTable";
import BugTextField from "@core/BugTextField";
import BugCodecAutocomplete from "@core/BugCodecAutocomplete";
import BugApiSelect from "@core/BugApiSelect";
import { useSelector } from "react-redux";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import StateLabel from "./StateLabel";
import GroupStats from "./GroupStats";
import PollIcon from "@mui/icons-material/Poll";
import LinkIcon from "@mui/icons-material/Link";

export default function Group({ group, panelId, onChange }) {
    const [tabIndex, setTabIndex] = React.useState(0);
    const panelConfig = useSelector((state) => state.panelConfig);
    const showAdvanced = panelConfig && panelConfig.data.showAdvanced;
    const sendAlert = useAlert();

    const handleGroupConnect = async () => {
        const url = `/container/${panelId}/connection/connect/${encodeURIComponent(group.id)}`;
        sendAlert(`Requested connection`, { variant: "info" });
        await AxiosCommand(url);
    };

    const handleConnect = async (connection) => {
        const url = `/container/${panelId}/connection/connect/${encodeURIComponent(connection.id)}`;
        sendAlert(`Requested connection`, { variant: "info" });
        await AxiosCommand(url);
    };

    const handleDisconnect = async (connection) => {
        const url = `/container/${panelId}/connection/disconnect/${encodeURIComponent(connection.cxnHandle)}`;
        sendAlert(`Requested disconnection`, { variant: "info" });
        await AxiosCommand(url);
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const renderConnection = () => {
        const connection = group.connections.find((c) => c.index === tabIndex);
        if (!connection) {
            return null;
        }
        if (connection.direction === "outbound") {
            return (
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
                            value: <StateLabel state={connection.state} />,
                        },
                        panelConfig.data.codecSource && {
                            name: "Destination",
                            value: (
                                <BugCodecAutocomplete
                                    addressValue={connection.destination}
                                    portValue={connection.audioPort}
                                    apiUrl={`/container/${panelId}/codecdb`}
                                    capability="tieline"
                                    onChange={(e, codec) =>
                                        onChange(group.id, connection.id, {
                                            destination: codec.address,
                                            audioPort: codec.port,
                                        })
                                    }
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
                        {
                            name: "",
                            value: (
                                <>
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
                                </>
                            ),
                        },
                    ]}
                />
            );
        }
        return (
            <BugDetailsTable
                sx={{
                    "& .MuiTableCell-root": {
                        height: "66px",
                    },
                }}
                width="8rem"
                items={[
                    {
                        name: "Incoming",
                        value: "TBC",
                    },
                ]}
            />
        );
    };

    return (
        <Grid item>
            <BugCard
                sx={{
                    width: "33rem",
                }}
            >
                <CardHeader
                    action={
                        group.connections.length > 1 && (
                            <BugApiButton
                                onClick={handleGroupConnect}
                                variant="outlined"
                                color="primary"
                                disabled={group._connected}
                            >
                                Connect All
                            </BugApiButton>
                        )
                    }
                    sx={{
                        borderBottom: "1px solid #181818",
                        height: "62.5px",
                    }}
                    title={group["_title"]}
                ></CardHeader>
                <CardContent
                    sx={{
                        padding: 0,
                        paddingLeft: "4px",
                        "&:last-child": {
                            paddingBottom: 0,
                        },
                    }}
                >
                    <Tabs
                        value={tabIndex}
                        textColor="primary"
                        onChange={handleTabChange}
                        sx={{
                            minHeight: 0,
                            borderBottom: "1px solid #181818",
                            "& .MuiTabs-indicator": {
                                backgroundColor: group.connections[tabIndex]?._connected
                                    ? "success.main"
                                    : "primary.main",
                            },
                            "& .MuiTab-labelIcon": {
                                minHeight: "auto",
                            },
                        }}
                    >
                        {group.connections.map((connection, index) => (
                            <Tab
                                label={connection._tabName}
                                key={index}
                                sx={{
                                    "&.Mui-selected": {
                                        color: connection._connected ? "success.main" : "primary.main",
                                    },
                                    color: connection._connected ? "success.main" : "secondary.main",
                                    "& .MuiTab-iconWrapper": {},
                                }}
                                icon={<LinkIcon />}
                                iconPosition="start"
                            />
                        ))}
                        <Tab
                            sx={{
                                "&.Mui-selected": {
                                    color: "primary.main",
                                },
                                color: "secondary.main",
                            }}
                            label="Stats"
                            value="stats"
                            icon={<PollIcon />}
                            iconPosition="start"
                        />
                    </Tabs>
                    <Box
                        sx={{
                            borderLeft: group.connections[tabIndex]?._connected
                                ? "4px solid green"
                                : "4px solid transparent",
                            borderRight: group.connections[tabIndex]?._connected
                                ? "4px solid green"
                                : "4px solid transparent",
                        }}
                    >
                        {tabIndex !== "stats" && renderConnection()}
                        {tabIndex === "stats" && <GroupStats group={group} panelId={panelId} />}
                    </Box>
                </CardContent>
            </BugCard>
        </Grid>
    );
}
