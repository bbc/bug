import BugApiButton from "@core/BugApiButton";
import BugCard from "@core/BugCard";
import LinkIcon from "@mui/icons-material/Link";
import PollIcon from "@mui/icons-material/Poll";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useSelector } from "react-redux";
import GroupRx from "./GroupRx";
import GroupStats from "./GroupStats";
import GroupTx from "./GroupTx";
import stateColor from "./stateColor";

export default function Group({ group, panelId, onChange }) {
    const [tabIndex, setTabIndex] = React.useState(0);
    const panelConfig = useSelector((state) => state.panelConfig);
    const showAdvanced = panelConfig && panelConfig.data.showAdvanced;
    const sendAlert = useAlert();

    const handleGroupConnect = async () => {
        const url = `/container/${panelId}/group/connect/${encodeURIComponent(group.id)}`;
        sendAlert(`Requested connection`, { variant: "info" });
        await AxiosCommand(url);
    };

    const handleGroupDisconnect = async () => {
        const url = `/container/${panelId}/group/disconnect/${encodeURIComponent(group.id)}`;
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
                <GroupTx
                    group={group}
                    onChange={onChange}
                    connection={connection}
                    panelId={panelId}
                    showAdvanced={showAdvanced}
                    panelConfig={panelConfig}
                />
            );
        }
        return (
            <GroupRx
                group={group}
                onChange={onChange}
                connection={connection}
                panelId={panelId}
                showAdvanced={showAdvanced}
                panelConfig={panelConfig}
            />
        );
    };

    const groupStateColor = stateColor({
        state: group.connections[tabIndex]?.state,
        txValue: group.connections[tabIndex]?.remoteLinkQuality,
        rxValue: group.connections[tabIndex]?.localLinkQuality,
    });

    const groupStateIndicatorColor =
        tabIndex === "stats"
            ? "text.action"
            : stateColor({
                  state: group.connections[tabIndex]?.state,
                  txValue: group.connections[tabIndex]?.remoteLinkQuality,
                  rxValue: group.connections[tabIndex]?.localLinkQuality,
                  idleColor: "action",
              });

    let borderColor = "transparent";
    if (group.connections[tabIndex]?.state && group.connections[tabIndex]?.state !== "Idle") {
        borderColor = groupStateColor;
    }

    return (
        <Grid key={group.id} item size={{ xxl: 4, lg: 6, xs: 12 }}>
            <BugCard fullHeight>
                <CardHeader
                    action={
                        <>
                            {group.connections.length > 1 && !group._anyconnected && (
                                <BugApiButton onClick={handleGroupConnect} variant="outlined" color="success">
                                    Connect All
                                </BugApiButton>
                            )}
                            {group._anyconnected && (
                                <BugApiButton onClick={handleGroupDisconnect} variant="outlined" color="error">
                                    Disconnect All
                                </BugApiButton>
                            )}
                        </>
                    }
                    sx={{
                        borderBottomWidth: "1px",
                        borderBottomStyle: "solid",
                        borderBottomColor: "border.light",
                        height: "68px",
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
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Tabs
                        value={tabIndex}
                        textColor="primary"
                        onChange={handleTabChange}
                        sx={{
                            minHeight: 0,
                            height: "56px",
                            borderBottomWidth: "1px",
                            borderBottomStyle: "solid",
                            borderBottomColor: "border.light",
                            "& .MuiTabs-indicator": {
                                backgroundColor: groupStateIndicatorColor,
                            },
                            "& .MuiTab-labelIcon": {
                                minHeight: "auto",
                            },
                        }}
                    >
                        {group.connections.map((connection, index) => {
                            const connectionColor = stateColor({
                                state: group.connections[index]?.state,
                                txValue: group.connections[index]?.remoteLinkQuality,
                                rxValue: group.connections[index]?.localLinkQuality,
                            });
                            const selectedConnectionColor = stateColor({
                                state: group.connections[index]?.state,
                                txValue: group.connections[index]?.remoteLinkQuality,
                                rxValue: group.connections[index]?.localLinkQuality,
                                idleColor: "action",
                            });
                            return (
                                <Tab
                                    label={connection._tabName}
                                    key={index}
                                    sx={{
                                        color: connectionColor,
                                        "&.Mui-selected": {
                                            color: selectedConnectionColor,
                                        },
                                        "& .MuiTab-iconWrapper": {},
                                    }}
                                    icon={<LinkIcon />}
                                    iconPosition="start"
                                />
                            );
                        })}
                        <Tab
                            sx={{
                                "&.Mui-selected": {
                                    color: "text.action",
                                },
                                color: "text.secondary",
                            }}
                            label="Stats"
                            value="stats"
                            icon={<PollIcon />}
                            iconPosition="start"
                        />
                    </Tabs>
                    <Box
                        sx={{
                            borderLeft: `4px solid ${borderColor}`,
                            borderRight: `4px solid ${borderColor}`,
                            flexGrow: 1,
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
