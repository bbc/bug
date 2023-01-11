import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import Box from "@mui/material/Box";
import BugStatusLabel from "@core/BugStatusLabel";
import BugPowerIcon from "@core/BugPowerIcon";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useForceRefresh } from "@hooks/ForceRefresh";
import { useBugCustomDialog } from "@core/BugCustomDialog";
import RouteFilterDialog from "./RouteFilterDialog";
import RouteOspfDialog from "./RouteOspfDialog";
import { useSelector } from "react-redux";
import CommentIcon from "@mui/icons-material/Comment";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

export default function RouteList({ panelId }) {
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();
    const { customDialog } = useBugCustomDialog();
    const [forceRefresh, doForceRefresh] = useForceRefresh();
    const panelData = useSelector((state) => state.panelData);

    const getStatus = (item) => {
        if (item.defaultActive) {
            return <BugStatusLabel color="text.highlight">Active</BugStatusLabel>;
        }
        if (item.disabled) {
            return <BugStatusLabel color="text.secondary">Inactive</BugStatusLabel>;
        }
        if (item.active) {
            return <BugStatusLabel color="success.main">Active</BugStatusLabel>;
        }
        return <BugStatusLabel color="text.primary">Pending</BugStatusLabel>;
    };

    const getItemName = (item) => {
        if (item.comment) {
            return item.comment;
        }
        if (item?.["dst-address"] === "0.0.0.0/0") {
            return "Default Route";
        }
        return "Static Route";
    };

    const handleCommentClicked = (event, item) => {
        if (item.dynamic !== true) {
            editStaticRouteComment(event, item);
        } else {
            editRouteFilter(event, item);
        }
    };

    const editRouteFilter = async (event, item) => {
        let result = false;
        if (item.ospf === true) {
            result = await customDialog({
                dialog: <RouteOspfDialog item={item} open={true} />,
            });
        } else {
            result = await customDialog({
                dialog: <RouteFilterDialog item={item} open={true} />,
            });
        }
        if (result === false) {
            return;
        }
        const url =
            item.ospf === true
                ? `/container/${panelId}/filter/ospfupdate/${result}`
                : `/container/${panelId}/filter/update/${item.distance}/${result}`;

        if (await AxiosCommand(url)) {
            sendAlert(`Set comment on route to '${result}'`, {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to set comment on route`, { variant: "error" });
        }
    };

    const editStaticRouteComment = async (event, item) => {
        let result = await renameDialog({
            title: "Edit route comment",
            defaultValue: item["comment"],
            confirmButtonText: "Change",
            allowBlank: true,
        });
        if (result === false) {
            return;
        }
        if (await AxiosCommand(`/container/${panelId}/route/comment/${item.id}/${result}`)) {
            sendAlert(`Set comment on route to '${result}'`, {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to set comment on route`, { variant: "error" });
        }
    };

    const handleEnabledChanged = async (checked, routeId) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        if (await AxiosCommand(`/container/${panelId}/route/${command}/${routeId}`)) {
            doForceRefresh();
            sendAlert(`${commandText} route`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} route`, { variant: "error" });
        }
    };

    const handleEnabledClicked = (event, item) => {
        handleEnabledChanged(true, item.id);
    };

    const handleDisabledClicked = (event, item) => {
        handleEnabledChanged(false, item.id);
    };

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    // noPadding: true,
                    width: 44,
                    field: "active",
                    content: (item) => (
                        <BugPowerIcon color={item.defaultActive ? "#ffffff" : "primary.main"} disabled={!item.active} />
                    ),
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
                                color={item.defaultActive ? "default" : "primary"}
                                onChange={(checked) => handleEnabledChanged(checked, item.id)}
                                disabled={item.static !== true}
                            />
                        );
                    },
                },
                {
                    sortable: false,
                    minWidth: "5rem",
                    noWrap: true,
                    title: "Status",
                    content: (item) => getStatus(item),
                },
                {
                    sortable: "true",
                    minWidth: "15rem",
                    noWrap: true,
                    field: "dst-address",
                    title: "Destination",
                    content: (item) => {
                        return (
                            <>
                                <BugTableLinkButton
                                    onClick={(event) => handleCommentClicked(event, item)}
                                    sx={{
                                        color: "text.primary",
                                    }}
                                >
                                    {getItemName(item)}
                                </BugTableLinkButton>
                                <BugStatusLabel
                                    sx={{
                                        opacity: item.defaultActive ? 0.5 : 0.8,
                                        color: item.defaultActive ? "text.action" : "text.secondary",
                                    }}
                                >
                                    {item?.["dst-address"]}
                                </BugStatusLabel>
                            </>
                        );
                    },
                },
                {
                    sortable: "true",
                    minWidth: "8rem",
                    noWrap: true,
                    field: "gateway",
                    title: "Gateway",
                    content: (item) => (item.type === "blackhole" ? "Blackhole" : item.gateway),
                },
                {
                    title: "Gateway Status",
                    content: (item) => (
                        <Box
                            sx={{
                                color: item.defaultActive ? "default.main" : "secondary.main",
                                opacity: item.defaultActive ? 0.8 : 1,
                            }}
                        >
                            {item?.["gateway-status"]}
                        </Box>
                    ),
                },
                {
                    sortable: "true",
                    title: "Distance",
                    width: "8rem",
                    field: "distance",
                    // hideWidth: 2000,
                    content: (item) => item["distance"],
                },
            ]}
            menuItems={[
                {
                    title: "Enable",
                    disabled: (item) => item.static !== true || !item.disabled,
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: handleEnabledClicked,
                },
                {
                    title: "Disable",
                    disabled: (item) => item.static !== true || item.disabled,
                    icon: <ToggleOffIcon fontSize="small" />,
                    onClick: handleDisabledClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Comment",
                    icon: <CommentIcon fontSize="small" />,
                    onClick: handleCommentClicked,
                },
            ]}
            apiUrl={panelData.showAll === true ? `/container/${panelId}/route/all` : `/container/${panelId}/route`}
            panelId={panelId}
            defaultSortDirection="asc"
            defaultSortIndex={3}
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
            forceRefresh={forceRefresh}
            highlightRow={(item) => {
                return item.defaultActive;
            }}
            highlightColor="success.main"
        />
    );
}
