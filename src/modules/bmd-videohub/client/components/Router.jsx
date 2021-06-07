import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "@components/Loading";
// import { Redirect } from "react-router";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useApiPoller } from "@utils/ApiPoller";
import GroupButton from "./GroupButton";
import RouterButton from "./RouterButton";
import AddGroupButton from "./AddGroupButton";
import RenameDialog from "./RenameDialog";
import AxiosPost from "@utils/AxiosPost";

const useStyles = makeStyles((theme) => ({
    content: {
        position: "relative",
        height: "100%",
        "@media (max-width:600px)": {
            position: "static",
        },
    },
    section: {
        fontSize: "0.875rem",
        fontWeight: 500,
        textTransform: "uppercase",
        padding: 15,
        backgroundColor: "#212121",
    },
    panel: {
        backgroundColor: "#262626",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    groupButtons: {
        padding: 8,
        "@media (max-width:600px)": {
            padding: "0px 2px",
        },
    },
    buttons: {
        padding: "0px 8px",
        marginBottom: 8,
        overflow: "auto",
        "@media (max-width:600px)": {
            padding: "0px 2px",
        },
    },
    sourcePanel: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: "50%",
        marginBottom: 12,
        "@media (max-width:1200px)": {
            marginBottom: 8,
        },
        "@media (max-width:1024px)": {
            marginBottom: 4,
        },
        "@media (max-width:600px)": {
            marginBottom: 1,
            position: "static",
        },
    },
    destinationPanel: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: "50%",
        marginTop: 12,
        "@media (max-width:1200px)": {
            marginTop: 8,
        },
        "@media (max-width:1024px)": {
            marginTop: 4,
        },
        "@media (max-width:600px)": {
            marginTop: 1,
            position: "static",
        },
    },
}));

export default function Router({ panelId, editMode = false }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [selectedDestination, setSelectedDestination] = React.useState(0);
    const [destinationGroup, setDestinationGroup] = React.useState(0);
    const [sourceGroup, setSourceGroup] = React.useState(0);
    const [destinationForceRefreshHash, setDestinationForceRefreshHash] = React.useState(0);
    const [addDialogType, setAddDialogType] = React.useState(null);

    const sourceButtons = useApiPoller({
        url: `/container/${panelId}/sources/${selectedDestination}/${sourceGroup}`,
        interval: editMode ? 5000 : 1000,
    });

    const destinationButtons = useApiPoller({
        url: `/container/${panelId}/destinations/${destinationGroup}`,
        interval: 5000,
        forceRefresh: destinationForceRefreshHash,
    });

    const handleSourceGroupButtonClicked = (groupIndex) => {
        setSourceGroup(groupIndex);
    };

    const handleDestinationGroupButtonClicked = (groupIndex) => {
        setSelectedDestination(-1);
        setDestinationGroup(groupIndex);
    };

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

        if (source.length === 1 && destination.length === 1) {
            if (await AxiosCommand(`/container/${panelId}/route/${selectedDestination}/${sourceIndex}`)) {
                sendAlert(`Successfully routed '${source[0].label}' to '${destination[0].label}'`, {
                    broadcast: true,
                    variant: "success",
                });
                return;
            }
        }
        sendAlert(`Failed to route '${source[0].label}' to '${destination[0].label}'`, { variant: "error" });

        // force a refresh of the destinations
        setDestinationForceRefreshHash(destinationForceRefreshHash + 1);
    };

    const handleAddGroup = async (value) => {
        if (await AxiosPost(`/container/${panelId}/groups/${addDialogType}/${value}`)) {
            setAddDialogType(null);
            sendAlert(`Added group: ${value}`, { variant: "success" });
        } else {
            sendAlert(`Failed to add group: ${value}`, { variant: "error" });
        }
    };

    const renderSources = () => {
        if (sourceButtons.status === "loading" || sourceButtons.status === "idle" || !sourceButtons.data) {
            return <Loading />;
        }

        return (
            <div className={classes.panel}>
                <div className={classes.section}>Sources</div>
                <div className={classes.groupButtons}>
                    {sourceButtons.data.groups.map((group) => (
                        <GroupButton
                            key={group.index}
                            selected={group.selected}
                            index={group.index}
                            primaryText={group.label}
                            onClick={() => handleSourceGroupButtonClicked(group.index)}
                            editMode={editMode}
                            panelId={panelId}
                            groupType="source"
                            onChange={() => handleGroupsChanged()}
                        />
                    ))}
                    {editMode && (
                        <AddGroupButton
                            onClick={() => {
                                setAddDialogType("source");
                            }}
                        />
                    )}
                </div>
                <div className={classes.buttons}>
                    {sourceButtons.data.sources.map((source) => (
                        <RouterButton
                            key={source.index}
                            selected={source.selected}
                            index={source.index}
                            primaryText={source.label}
                            onClick={() => handleSourceButtonClicked(source.index)}
                            editMode={editMode}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderDestinations = () => {
        if (
            destinationButtons.status === "loading" ||
            destinationButtons.status === "idle" ||
            !destinationButtons.data
        ) {
            return <Loading />;
        }

        return (
            <div className={classes.panel}>
                <div className={classes.section}>Destinations</div>
                <div className={classes.groupButtons}>
                    {destinationButtons.data.groups.map((group) => (
                        <GroupButton
                            key={group.index}
                            selected={destinationGroup === group.index}
                            index={group.index}
                            primaryText={group.label}
                            onClick={() => handleDestinationGroupButtonClicked(group.index)}
                            editMode={editMode}
                            panelId={panelId}
                            groupType="destination"
                            onChange={() => handleGroupsChanged()}
                        />
                    ))}
                    {editMode && (
                        <AddGroupButton
                            onClick={() => {
                                setAddDialogType("destination");
                            }}
                        />
                    )}
                </div>
                <div className={classes.buttons}>
                    {destinationButtons.data.destinations.map((destination) => (
                        <RouterButton
                            key={destination.index}
                            selected={selectedDestination === destination.index}
                            index={destination.index}
                            primaryText={destination.label}
                            secondaryText={destination.sourceLabel}
                            onClick={() => handleDestinationButtonClicked(destination.index)}
                            editMode={editMode}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // if (redirectUrl) {
    //     return <Redirect push to={{ pathname: redirectUrl }} />;
    // }

    return (
        <>
            <div className={classes.content}>
                <div className={classes.sourcePanel}>{renderSources()}</div>
                <div className={classes.destinationPanel}>{renderDestinations()}</div>
            </div>
            {addDialogType && (
                <RenameDialog
                    title="Add group"
                    label="Group name"
                    panelId={panelId}
                    type={addDialogType}
                    onCancel={() => setAddDialogType(null)}
                    onSubmit={handleAddGroup}
                    buttonText="Add"
                />
            )}
        </>
    );
}
