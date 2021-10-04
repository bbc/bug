import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import { useApiPoller } from "@utils/ApiPoller";
import BugApiTable from "@core/BugApiTable";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import ApiSwitch from "@core/ApiSwitch";
import Chip from "@material-ui/core/Chip";
import CloudIcon from "@material-ui/icons/Cloud";
import VideocamIcon from "@material-ui/icons/Videocam";
import AxiosGet from "@utils/AxiosGet";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useAlert } from "@utils/Snackbar";
import { useHistory } from "react-router-dom";
import SparkCellGeneric from "@core/SparkCellGeneric";

const height = 100;

const useStyles = makeStyles((theme) => ({
    thumbnail: {
        display: "block",
        margin: "auto",
        height: height,
        width: height * (16 / 9),
        padding: 15,
    },

    iconRunning: {
        color: theme.palette.primary.main,
        display: "block",
        margin: "auto",
        minWidth: 36,
    },
    icon: {
        opacity: 0.1,
        display: "block",
        margin: "auto",
        minWidth: 36,
    },
    streaming: {
        backgroundColor: theme.palette.primary.main,
        color: "#ffffff",
    },
    failed: {
        backgroundColor: "#333",
        color: theme.palette.error.main,
    },
    connecting: {
        backgroundColor: "#333",
        color: "#555",
    },
    chip: {
        margin: 2,
        border: "none",
        borderRadius: 3,
    },
    channel: {
        margin: 2,
        border: "none",
        backgroundColor: theme.palette.primary.main,
    },
}));

export default function DecodersTable({ panelId }) {
    const classes = useStyles();
    const { confirmDialog } = useBugConfirmDialog();
    const sendAlert = useAlert();
    const history = useHistory();

    const encoders = useApiPoller({
        url: `/container/${panelId}/encoder/`,
        interval: 10000,
    });

    // const channels = useApiPoller({
    //     url: `/container/${panelId}/channel/`,
    //     interval: 11000,
    // });

    const handleRowClicked = (event, item) => {
        history.push(`/panel/${panelId}/decoder/${item.sid}`);
    };

    const getColor = (status) => {
        if (status === "connecting") {
            return classes.connecting;
        }
        if (status === "streaming") {
            return classes.streaming;
        }
        if (status === "failed") {
            return classes.failed;
        }
        return null;
    };

    const getDeviceName = (sid) => {
        if (!encoders.data) {
            return sid;
        }
        const selectedDevice = encoders.data.find((encoder) => encoder.id === sid);
        if (!selectedDevice) {
            return sid;
        }

        return selectedDevice.name;
    };

    const getChannelName = (id) => {
        if (!channels.data) {
            return id;
        }
        const selectedChannel = channels.data.find((channel) => channel.id === id);
        if (!selectedChannel) {
            return id;
        }

        return selectedChannel.name;
    };

    const getThumbnail = (item) => {
        let src = "/images/blank.png";

        if (item.thumbnail) {
            src = item.thumbnail;
        }

        return <img src={src} className={classes.thumbnail} />;
    };

    const getLinkedDevices = (item) => {
        console.log(item);
        const chips = [];
        if (item?.links) {
            if (item.links.status !== "failed") {
                chips.push(
                    <Chip
                        icon={<VideocamIcon />}
                        key={item?.encoderSid}
                        className={`${classes.chip} ${getColor(item?.status)}`}
                        onDelete={(event) => {
                            handleUnpair(event, item.links?.encoderSid, item?.sid);
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                        }}
                        label={getDeviceName(item.links?.encoderSid)}
                    />
                );
            }
        }

        return chips;
    };

    // const getLinkedDevices = (links) => {
    //     const chips = [];
    //     if (links?.encoderSid) {
    //         chips.push(
    //             <Chip
    //                 icon={<VideocamIcon />}
    //                 key={links?.encoderSid}
    //                 size="small"
    //                 className={getColor(decoder?.status)}
    //                 onDelete={(event) => {
    //                     handleUnpair(decoder?.sid);
    //                 }}
    //                 label={getDeviceName(links?.encoderSid)}
    //                 variant="outlined"
    //             />
    //         );
    //     }

    //     return chips;
    // };

    const handleEnabledChanged = async (checked, decoder) => {
        const command = checked ? "start" : "stop";
        const verb = checked ? "Started" : "Stopped";
        if (await AxiosCommand(`/container/${panelId}/device/start/${sid}`)) {
            sendAlert(`${verb} decoder: ${decoder.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} encoder: ${decoder.name}`, { variant: "error" });
        }
    };

    const handleUnpair = async (event, encoderId, decoderId) => {
        // if (
        //     await confirmDialog({
        //         title: "Unlink decoder",
        //         message: "Are you sure? This will unlink the specified endoder and decoder",
        //         confirmButtonText: "Unlink",
        //     })
        // ) {
        //     if (await AxiosGet(`/container/${panelId}/encoder/unpair/${encoderId}/${decoderId}`)) {
        //         sendAlert(`Successfully unlinked decoder`, { variant: "success" });
        //     } else {
        //         sendAlert(`Failed to unlink decoder`, { variant: "error" });
        //     }
        // }
        // event.stopPropagation();
        // event.preventDefault();
    };

    const isEnabled = (decoder) => {
        if (decoder?.streamStatus === "streaming") {
            return true;
        }
        return false;
    };

    const isOnline = (decoder) => {
        if (decoder?.status === "online") {
            return true;
        }
        return false;
    };

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    noPadding: true,
                    // hideWidth: 440,
                    width: 58,
                    field: "status",
                    content: (item) => {
                        return <PowerSettingsNew className={isEnabled() ? classes.iconRunning : classes.icon} />;
                    },
                },
                {
                    sortable: false,
                    noPadding: true,
                    // hideWidth: 1200,
                    width: 82,
                    content: (item) => {
                        return (
                            <ApiSwitch
                                checked={isEnabled(item)}
                                disabled={!isOnline(item)}
                                onChange={(checked) => handleEnabledChanged(checked, item)}
                            />
                        );
                    },
                },
                {
                    width: 300,
                    minWidth: 200,
                    noWrap: true,
                    content: (item) => {
                        return item.name;
                    },
                },
                {
                    content: (item) => {
                        return <>{item.model}</>;
                    },
                },
                {
                    content: (item) => {
                        return getLinkedDevices(item);
                    },
                },
                {
                    width: "12rem",
                    content: (item) => {
                        return (
                            <SparkCellGeneric
                                units="fps"
                                historyKey="decoder_vdec_framerate"
                                history={item?.decoderStats}
                            />
                        );
                    },
                },
            ]}
            menuItems={[
                // {
                //     title: "Edit Lease",
                //     icon: <EditIcon fontSize="small" />,
                //     onClick: handleDetailsClicked,
                // },
                // {
                //     title: "Comment",
                //     disabled: (item) => item.dynamic,
                //     icon: <CommentIcon fontSize="small" />,
                //     onClick: handleCommentClicked,
                // },
                // {
                //     title: "Make Static",
                //     disabled: (item) => !item.dynamic,
                //     icon: <GpsFixedIcon fontSize="small" />,
                //     onClick: handleMakeStaticClicked,
                // },
                // {
                //     title: "-",
                // },
                {
                    title: "Enable",
                    disabled: (item) => !item.disabled,
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: (item) => {
                        handleEnabledChanged(true, item);
                    },
                },
                {
                    title: "Disable",
                    disabled: (item) => item.disabled,
                    icon: <ToggleOffIcon fontSize="small" />,
                    onClick: (item) => {
                        handleEnabledChanged(false, item);
                    },
                },
                // {
                //     title: "-",
                // },
                // {
                //     title: "Delete",
                //     icon: <DeleteIcon fontSize="small" />,
                //     onClick: handleDeleteClicked,
                // },
                // {
                //     title: "-",
                // },
                // {
                //     title: "Wake Up (WOL)",
                //     disabled: (item) => item.status === "bound",
                //     icon: <PowerSettingsNew fontSize="small" />,
                //     onClick: handleWolClicked,
                // },
            ]}
            defaultSortIndex={4}
            apiUrl={`/container/${panelId}/decoder/selected`}
            panelId={panelId}
            onRowClick={handleRowClicked}
            hideHeader={true}
        />
    );
}
