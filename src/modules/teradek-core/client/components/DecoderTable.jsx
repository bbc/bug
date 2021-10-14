import React from "react";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useApiPoller } from "@utils/ApiPoller";
import BugApiTable from "@core/BugApiTable";
import PowerIcon from "@core/PowerIcon";
import ApiSwitch from "@core/ApiSwitch";
import AxiosGet from "@utils/AxiosGet";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useAlert } from "@utils/Snackbar";
import { useHistory } from "react-router-dom";
import SparkCell from "@core/SparkCell";
import Typography from "@mui/material/Typography";
import BugApiAutocomplete from "@core/BugApiAutocomplete";

export default function DecodersTable({ panelId }) {
    const { confirmDialog } = useBugConfirmDialog();
    const sendAlert = useAlert();
    const history = useHistory();

    const encoders = useApiPoller({
        url: `/container/${panelId}/encoder/`,
        interval: 10000,
    });

    const handlePair = async (encoderId, decoderId) => {
        if (await AxiosGet(`/container/${panelId}/decoder/pair/${encoderId}/${decoderId}`)) {
            sendAlert(`Successfully changed decoder source`, { variant: "success" });
        } else {
            sendAlert(`Failed to change decoder source`, { variant: "error" });
        }
    };

    const handleUnpair = async (encoderId, decoderId) => {
        if (await AxiosGet(`/container/${panelId}/encoder/unpair/${encoderId}/${decoderId}`)) {
            sendAlert(`Successfully unlinked decoder`, { variant: "success" });
        } else {
            sendAlert(`Failed to unlink decoder`, { variant: "error" });
        }
    };

    const handleEncoderChanged = (item, value) => {
        if (value) {
            handlePair(value?.id, item.sid);
        } else {
            handleUnpair(item?.link?.encoderSid, item.sid);
        }
    };

    // const getEncoderAutocompleteControl = (item) => {
    //     // we need to get the label/id pair from the encoders array for the currently selected value
    //     const selectedEncoderObject = encoders?.data?.find((object) => object.id === item?.link?.encoderSid);

    //     return (
    //         <Autocomplete
    //             filterSelectedOptions
    //             options={encoders.data}
    //             onChange={(event, value) => {
    //                 if (value) {
    //                     handlePair(value?.id, item.sid);
    //                 } else {
    //                     handleUnpair(item?.link?.encoderSid, item.sid);
    //                 }
    //                 event.stopPropagation();
    //                 event.preventDefault();
    //             }}
    //             onClick={(event) => {
    //                 event.stopPropagation();
    //                 event.preventDefault();
    //             }}
    //             // defaultValue={processValues(value)}
    //             value={selectedEncoderObject}
    //             renderInput={(params) => (
    //                 <TextField
    //                     {...params}
    //                     variant="outlined"
    //                     onClick={(event) => {
    //                         event.stopPropagation();
    //                         event.preventDefault();
    //                     }}
    //                 />
    //             )}
    //         />
    //     );
    // };

    // const getLinkedDevices = (item) => {
    //     console.log(item);
    //     const chips = [];
    //     if (item?.links) {
    //         if (item.links.status !== "failed") {
    //             chips.push(
    //                 <Chip
    //                     icon={<VideocamIcon />}
    //                     key={item?.links.encoderSid}
    //                     className={`${classes.chip} ${getColor(item?.status)}`}
    //                     onDelete={(event) => {
    //                         handleUnpair(event, item.links?.encoderSid, item?.sid);
    //                     }}
    //                     onClick={(event) => {
    //                         event.stopPropagation();
    //                         event.preventDefault();
    //                     }}
    //                     label={getDeviceName(item.links?.encoderSid)}
    //                 />
    //             );
    //         }
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
                    content: (item) => <PowerIcon enabled={isEnabled()} />,
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
                    width: "30%",
                    noWrap: true,
                    content: (item) => (
                        <>
                            <Typography variant="body1">{item.customName}</Typography>
                            <Typography variant="subtitle1">{item.model}</Typography>
                        </>
                    ),
                },
                {
                    width: "40%",
                    content: (item) => (
                        <BugApiAutocomplete
                            options={encoders?.data}
                            value={item?.link?.encoderSid}
                            onChange={(event, value) => handleEncoderChanged(item, value)}
                        />
                    ),
                },
                {
                    width: "30%",
                    content: (item) => {
                        return (
                            <SparkCell
                                height={30}
                                value={item["framerate-text"]}
                                history={item.decoderStats?.slice(-60)}
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
            hideHeader={true}
        />
    );
}
