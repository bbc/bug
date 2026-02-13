import BugApiSwitch from "@core/BugApiSwitch";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import BugPowerIcon from "@core/BugPowerIcon";
import { useBugRenameDialog } from "@core/BugRenameDialog";
// import BugSparkCell from "@core/BugSparkCell";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useForceRefresh } from "@hooks/ForceRefresh";
// import CheckIcon from "@mui/icons-material/Check";
// import CommentIcon from "@mui/icons-material/Comment";
// import EditIcon from "@mui/icons-material/Edit";
// import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
// import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import ToggleOnIcon from "@mui/icons-material/ToggleOn";
// import { Box } from "@mui/material";
import BugStatusLabel from "@core/BugStatusLabel";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useNavigate } from "react-router-dom";

export default function RouteList({ panelId }) {
    const sendAlert = useAlert();
    const navigate = useNavigate();
    const { renameDialog } = useBugRenameDialog();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    // const handleRenameClicked = async (event, item) => {
    //     event.stopPropagation();

    //     let result = await renameDialog({
    //         title: "Edit interface name",
    //         defaultValue: item["name"],
    //         placeholder: item["default-name"],
    //         confirmButtonText: "Rename",
    //         allowBlank: true,
    //     });
    //     if (result === false) {
    //         return;
    //     }
    //     if (result === "") {
    //         result = item["default-name"];
    //     }
    //     if (await AxiosCommand(`/container/${panelId}/interface/rename/${item.id}/${encodeURIComponent(result)}`)) {
    //         sendAlert(`Renamed interface to ${result}`, { broadcast: "true", variant: "success" });
    //         doForceRefresh();
    //     } else {
    //         sendAlert(`Failed to rename interface to ${result}`, { variant: "error" });
    //     }
    // };

    const handleNameClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "Rename route",
            defaultValue: item.comment,
            confirmButtonText: "Rename",
            allowBlank: true,
            placeholder: item.name,
        });
        if (result === false) {
            return;
        }
        if (
            await AxiosPut(`/container/${panelId}/route/rename`, {
                id: item.id,
                name: result,
            })
        ) {
            const messsage = result
                ? `Renamed route '${item.comment ? item.comment : item.name}' to '${result}'`
                : `Cleared route name`;
            sendAlert(messsage, {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to rename route ${item.name}`, { variant: "error" });
        }
    };

    // const handleDetailsClicked = (event, item) => {
    //     navigate(`/panel/${panelId}/interface/${item.name}`);
    // };

    // const handleEnabledChanged = async (checked, interfaceName) => {
    //     const command = checked ? "enable" : "disable";
    //     const commandText = checked ? "Enabled" : "Disabled";
    //     if (await AxiosCommand(`/container/${panelId}/interface/${command}/${interfaceName}`)) {
    //         sendAlert(`${commandText} interface: ${interfaceName}`, { variant: "success" });
    //         doForceRefresh();
    //     } else {
    //         sendAlert(`Failed to ${command} interface: ${interfaceName}`, { variant: "error" });
    //     }
    // };

    // const handleProtectClicked = async (event, item) => {
    //     const command = item._protected ? "unprotect" : "protect";
    //     const commandAction = item._protected ? "Unprotected" : "Protected";

    //     if (await AxiosCommand(`/container/${panelId}/interface/${command}/${item.name}`)) {
    //         sendAlert(`${commandAction} interface: ${item.name}`, { variant: "success" });
    //         doForceRefresh();
    //     } else {
    //         sendAlert(`Failed to ${command} interface: ${item.name}`, { variant: "error" });
    //     }
    // };

    // const handleEnabledClicked = (event, item) => {
    //     handleEnabledChanged(true, item.name);
    // };

    // const handleDisabledClicked = (event, item) => {
    //     handleEnabledChanged(false, item.name);
    // };

    // const handleLldpClicked = (event, item) => {};

    // const getItemNeighbor = (item) => {
    //     if (item?.lldp === undefined || item?.lldp.length === 0) {
    //         return null;
    //     }
    //     if (item?.lldp.length > 1) {
    //         return `${item?.lldp.length} device(s)`;
    //     }
    //     if (item.lldp[0].identity) {
    //         return item.lldp[0].identity;
    //     }
    //     return "1 device";
    // };

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    noPadding: true,
                    width: 44,
                    field: "running",
                    content: (item) => <BugPowerIcon disabled={!item.pingOk && !item.dynamic} />,
                },
                {
                    sortable: false,
                    noPadding: true,
                    hideWidth: 700,
                    width: 70,
                    content: (item) => {
                        return (
                            <BugApiSwitch
                                checked={!item.disabled}
                                // onChange={(checked) => handleEnabledChanged(checked, item.name)}
                                disabled={item.dynamic}
                            />
                        );
                    },
                },
                {
                    sortable: true,
                    minWidth: "5rem",
                    noWrap: true,
                    field: "name",
                    title: "Name",
                    content: (item) => {
                        return (
                            <>
                                <BugTableLinkButton onClick={(event) => handleNameClicked(event, item)}>
                                    {item.comment ? item.comment : item.name}
                                </BugTableLinkButton>
                            </>
                        );
                    },
                },
                {
                    title: "Status",
                    width: "10rem",
                    hideWidth: 650,
                    content: (item) => (
                        <>
                            <BugStatusLabel
                                sx={{
                                    color: item.pingOk || item.dynamic ? "success.main" : "error.main",
                                }}
                            >
                                {item.pingOk || item.dynamic ? "CONNECTED" : "NOT CONNECTED"}
                            </BugStatusLabel>
                        </>
                    ),
                },
                {
                    title: "LAN Address",
                    // hideWidth: 650,
                    content: (item) => item.address,
                },
                {
                    title: "WAN Address",
                    // hideWidth: 650,
                    content: (item) => item.wanAddress,
                },
                {
                    title: "Distance",
                    // hideWidth: 650,
                    content: (item) => item.distance,
                },
            ]}
            menuItems={
                [
                    // {
                    //     title: "View Details",
                    //     icon: <SettingsInputComponentIcon fontSize="small" />,
                    //     onClick: handleDetailsClicked,
                    // },
                    // {
                    //     title: "-",
                    // },
                    // {
                    //     title: "Enable",
                    //     disabled: (item) => !item.disabled || item._protected,
                    //     icon: <ToggleOnIcon fontSize="small" />,
                    //     onClick: handleEnabledClicked,
                    // },
                    // {
                    //     title: "Disable",
                    //     disabled: (item) => item.disabled || item._protected,
                    //     icon: <ToggleOffIcon fontSize="small" />,
                    //     onClick: handleDisabledClicked,
                    // },
                    // {
                    //     title: "-",
                    // },
                    // {
                    //     title: "Rename",
                    //     disabled: (item) => item._protected,
                    //     icon: <EditIcon fontSize="small" />,
                    //     onClick: handleRenameClicked,
                    // },
                    // {
                    //     title: "Comment",
                    //     disabled: (item) => item._protected,
                    //     icon: <CommentIcon fontSize="small" />,
                    //     onClick: handleCommentClicked,
                    // },
                    // {
                    //     title: "-",
                    // },
                    // {
                    //     title: "Protect",
                    //     disabled: (item) => item._protected && !item._allowunprotect,
                    //     icon: (item) => (item._protected ? <CheckIcon fontSize="small" /> : null),
                    //     onClick: handleProtectClicked,
                    // },
                ]
            }
            apiUrl={`/container/${panelId}/route`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No routes found"
                    message="Click to edit panel configuration"
                    showConfigButton={true}
                />
            }
            rowHeight="62px"
            sortable
            // onRowClick={handleDetailsClicked}
            forceRefresh={forceRefresh}
        />
    );
}
