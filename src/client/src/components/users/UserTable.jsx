import React from "react";
import { useSelector } from "react-redux";
import BugApiTable from "@core/BugApiTable";
import { useHistory } from "react-router-dom";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";

export default function UserTable({ interval }) {
    const history = useHistory();
    const user = useSelector((state) => state.user);
    const currentUserId = user.status === "success" ? user.data?.id : null;
    const sendAlert = useAlert();

    const handleRowClick = (event, item) => {
        history.push(`/system/user/${item.id}`);
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
            showNavArrow
            filterable
            hideHeader={false}
            apiUrl={`/api/user/list`}
        />
    );
}
