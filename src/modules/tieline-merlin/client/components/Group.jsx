import React from "react";
import BugCard from "@core/BugCard";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BugApiButton from "@core/BugApiButton";
import { useSelector } from "react-redux";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import GroupStats from "./GroupStats";
import PollIcon from "@mui/icons-material/Poll";
import LinkIcon from "@mui/icons-material/Link";
import GroupTx from "./GroupTx";
import GroupRx from "./GroupRx";
import stateColor from "./stateColor";

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

    let borderColor = "transparent";
    if (group.connections[tabIndex]?.state && group.connections[tabIndex]?.state !== "Idle") {
        borderColor = groupStateColor;
    }

    return (
        <Grid key={group.id} item xxl={4} lg={6} xs={12}>
            <BugCard fullHeight>
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
                                backgroundColor: groupStateColor,
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
                                        color: groupStateColor,
                                    },
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
