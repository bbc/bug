import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "@components/Loading";
// import { Redirect } from "react-router";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useApiPoller } from "@utils/ApiPoller";
import GroupButton from "./GroupButton";
import RouterButton from "./RouterButton";

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

export default function Router({ panelId }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [selectedDestination, setSelectedDestination] = React.useState(0);
    const [destinationGroup, setDestinationGroup] = React.useState(0);
    const [sourceGroup, setSourceGroup] = React.useState(0);
    const [destinationForceRefreshHash, setDestinationForceRefreshHash] = React.useState(0);

    const sourceButtons = useApiPoller({
        url: `/container/${panelId}/sources/${selectedDestination}/${sourceGroup}`,
        interval: 1000,
    });

    const destinationButtons = useApiPoller({
        url: `/container/${panelId}/destinations/${destinationGroup}`,
        interval: 5000,
        forceRefresh: destinationForceRefreshHash,
    });

    const handleGroupButtonClicked = (groupIndex) => {
        setSelectedDestination(-1);
        setDestinationGroup(groupIndex);
    };

    const handleSourceButtonClicked = async (sourceIndex) => {
        let source = sourceButtons.data.sources.filter((x) => x.index === sourceIndex);
        let destination = destinationButtons.data.destinations.filter((x) => x.index === selectedDestination);

        let successMessage = `Successfully routed source ${sourceIndex + 1} to destination ${selectedDestination + 1}`;
        let failMessage = `Failed to route source ${sourceIndex + 1} to destination ${selectedDestination + 1}`;
        if (source.length === 1 && destination.length === 1) {
            successMessage = `Successfully routed '${source[0].label}' to '${destination[0].label}'`;
            failMessage = `Failed to route '${source[0].label}' to '${destination[0].label}'`;
        }
        if (await AxiosCommand(`/container/${panelId}/route/${selectedDestination}/${sourceIndex}`)) {
            sendAlert(successMessage, { broadcast: true, variant: "success" });
        } else {
            sendAlert(failMessage, { variant: "error" });
        }

        // force a refresh of the destinations
        setDestinationForceRefreshHash(destinationForceRefreshHash + 1);
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
                            text={group.label}
                            onClick={() => setSourceGroup(group.index)}
                        />
                    ))}
                </div>
                <div className={classes.buttons}>
                    {sourceButtons.data.sources.map((source) => (
                        <RouterButton
                            key={source.index}
                            selected={source.selected}
                            index={source.index}
                            primaryText={source.label}
                            onClick={() => handleSourceButtonClicked(source.index)}
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
                            text={group.label}
                            onClick={() => handleGroupButtonClicked(group.index)}
                        />
                    ))}
                </div>
                <div className={classes.buttons}>
                    {destinationButtons.data.destinations.map((destination) => (
                        <RouterButton
                            key={destination.index}
                            selected={selectedDestination === destination.index}
                            index={destination.index}
                            primaryText={destination.label}
                            secondaryText={destination.sourceLabel}
                            onClick={() => setSelectedDestination(destination.index)}
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
        </>
    );
}
