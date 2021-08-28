import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "@components/Loading";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useApiPoller } from "@utils/ApiPoller";
import GroupButtons from "./GroupButtons";
import RouterButtons from "./RouterButtons";
import { useSelector } from "react-redux";

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
        padding: 12,
        backgroundColor: "#212121",
        "@media (max-width:800px)": {
            fontSize: 12,
            backgroundColor: "inherit",
            padding: "6px 6px 2px 6px",
        },
    },
    panel: {
        backgroundColor: "#262626",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "@media (max-height:400px)": {
            overflow: "auto",
        },
    },
    sourcePanel: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: "50%",
        marginBottom: 2,
        // "@media (max-width:1200px)": {
        //     marginBottom: 8,
        // },
        // "@media (max-width:1024px)": {
        //     marginBottom: 4,
        // },
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
        marginTop: 2,
        // "@media (max-width:1200px)": {
        //     marginTop: 8,
        // },
        // "@media (max-width:1024px)": {
        //     marginTop: 4,
        // },
        "@media (max-width:600px)": {
            // marginTop: 1,
            position: "static",
        },
    },
}));

export default function Router({ panelId, editMode = false, sourceGroup = 0, destinationGroup = 0 }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [selectedDestination, setSelectedDestination] = React.useState(null);
    const [sourceForceRefreshHash, setSourceForceRefreshHash] = React.useState(0);
    const [destinationForceRefreshHash, setDestinationForceRefreshHash] = React.useState(0);
    const panelConfig = useSelector((state) => state.panelConfig);

    const useDoubleClick = panelConfig && panelConfig.data.useTake;

    const sourceButtons = useApiPoller({
        url: `/container/${panelId}/sources/${selectedDestination === null ? -1 : selectedDestination}/${sourceGroup}`,
        interval: editMode ? 5000 : 500,
        forceRefresh: sourceForceRefreshHash,
    });

    const destinationButtons = useApiPoller({
        url: `/container/${panelId}/destinations/${destinationGroup}`,
        interval: 5000,
        forceRefresh: destinationForceRefreshHash,
    });

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

        if (await AxiosCommand(`/container/${panelId}/route/${selectedDestination}/${sourceIndex}`)) {
            sendAlert(`Successfully routed '${source[0].label}' to '${destination[0].label}'`, {
                broadcast: true,
                variant: "success",
            });
            // force a refresh of the destinations
            setDestinationForceRefreshHash(destinationForceRefreshHash + 1);
            return;
        }
        sendAlert(`Failed to route '${source[0].label}' to '${destination[0].label}'`, { variant: "error" });
    };

    const renderSources = () => {
        if (sourceButtons.status === "loading" || sourceButtons.status === "idle" || !sourceButtons.data) {
            return <Loading />;
        }

        return (
            <div className={classes.panel}>
                <div className={classes.section}>Sources</div>
                <GroupButtons
                    panelId={panelId}
                    editMode={editMode}
                    groupType="source"
                    selectedDestination={selectedDestination}
                    buttons={sourceButtons}
                    onChange={() => setSourceForceRefreshHash(sourceForceRefreshHash + 1)}
                />
                <RouterButtons
                    panelId={panelId}
                    editMode={editMode}
                    buttonType="source"
                    selectedDestination={selectedDestination}
                    buttons={sourceButtons}
                    onClick={handleSourceButtonClicked}
                    useDoubleClick={useDoubleClick}
                    onChange={() => setSourceForceRefreshHash(sourceForceRefreshHash + 1)}
                />
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
                <GroupButtons
                    panelId={panelId}
                    editMode={editMode}
                    groupType="destination"
                    buttons={destinationButtons}
                    onChange={() => setDestinationForceRefreshHash(destinationForceRefreshHash + 1)}
                />
                <RouterButtons
                    panelId={panelId}
                    editMode={editMode}
                    buttonType="destination"
                    selectedDestination={selectedDestination}
                    buttons={destinationButtons}
                    onClick={handleDestinationButtonClicked}
                    onChange={() => setDestinationForceRefreshHash(destinationForceRefreshHash + 1)}
                />
            </div>
        );
    };

    return (
        <>
            <div className={classes.content}>
                <div className={classes.sourcePanel}>{renderSources()}</div>
                <div className={classes.destinationPanel}>{renderDestinations()}</div>
            </div>
        </>
    );
}
