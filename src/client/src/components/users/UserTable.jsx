import React from "react";
import { useSelector } from "react-redux";
import BugApiTable from "@core/BugApiTable";
import { useHistory } from "react-router-dom";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useForceRefresh } from "@hooks/ForceRefresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";

export default function UserTable({ interval }) {
    const history = useHistory();
    const user = useSelector((state) => state.user);
    const currentUserId = user.status === "success" ? user.data?.id : null;
    const sendAlert = useAlert();
    const { forceRefresh, doForceRefresh } = useForceRefresh();
    const { confirmDialog } = useBugConfirmDialog();

    const handleRowClick = (event, item) => {
        history.push(`/system/user/${item.id}`);
    };

    const handleEditClick = (event, item) => {
        history.push(`/system/user/${item.id}`);
    };

    const handleDeleteClick = async (event, item) => {
        const result = await confirmDialog({
            title: "Delete user?",
            message: ["This will delete the user and all of their settings.", "Are you sure?"],
            confirmButtonText: "Delete",
        });

        if (result !== false) {
            if (await AxiosDelete(`/api/user/${item.id}`)) {
                sendAlert(`Deleted user: ${item.name}`, { broadcast: true, variant: "success" });
            } else {
                sendAlert(`Failed to delete user: ${item.name}`, { variant: "error" });
            }
        }
    };

    const handleSwitchChange = async (checked, item) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        let status;

        if (checked) {
            status = await AxiosCommand(`/api/user/${item.id}/enable`);
        } else {
            status = await AxiosCommand(`/api/user/${item.id}/disable`);
        }

        if (status) {
            doForceRefresh();
            sendAlert(`${commandText} ${item.username}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to ${command} ${item.username}`, {
                variant: "error",
            });
        }
    };

    return (
        <BugApiTable
            columns={[
                {
                    width: "2rem",
                    content: (item) => (
                        <BugApiSwitch
                            checked={item.enabled}
                            onChange={(checked) => handleSwitchChange(checked, item)}
                            disabled={item.enabled && item.id === currentUserId}
                        />
                    ),
                },
                {
                    title: "Username",
                    field: "username",
                    sortable: true,
                    content: (item) => item.username,
                },
                {
                    title: "Name",
                    field: "name",
                    sortable: true,
                    content: (item) => item.name,
                },
                {
                    title: "Email",
                    field: "email",
                    sortable: true,
                    hideWidth: 800,
                    content: (item) => item.email,
                },
            ]}
            onRowClick={handleRowClick}
            defaultSortIndex={1}
            defaultSortDirection="asc"
            sortable
            filterable
            hideHeader={false}
            apiUrl={`/api/user/list`}
            menuItems={[
                {
                    title: "Enable",
                    disabled: (item) => item.enabled,
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: (event, item) => handleSwitchChange(true, item),
                },
                {
                    title: "Disable",
                    disabled: (item) => !item.enabled && item.id === currentUserId,
                    icon: <ToggleOffIcon fontSize="small" />,
                    onClick: (event, item) => handleSwitchChange(false, item),
                },
                {
                    title: "-",
                },
                {
                    title: "Edit",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleEditClick,
                },
                {
                    title: "Delete",
                    disabled: (item) => item.id === currentUserId,
                    icon: <DeleteIcon fontSize="small" />,
                    onClick: handleDeleteClick,
                },
            ]}
            forceRefresh={forceRefresh}
        />
    );
}
