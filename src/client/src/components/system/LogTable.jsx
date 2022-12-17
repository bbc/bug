import React from "react";
import PropTypes from "prop-types";
import BugNoData from "@core/BugNoData";
import BugLoading from "@core/BugLoading";
import BugApiTable from "@core/BugApiTable";
import BugChipDisplay from "@core/BugChipDisplay";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { useApiPoller } from "@hooks/ApiPoller";
import getGravatarUrl from "@utils/getGravatarUrl";

export default function LogTable({ panelId, level, interval }) {
    const panelFilter = useSelector((state) =>
        state.panelList.data.map((item) => {
            return { label: item.title, id: item.id };
        })
    );

    const users = useApiPoller({
        url: `/api/user`,
        interval: 5000,
    });

    const currentUser = useSelector((state) => state.user);

    const getUser = (userId) => {
        if (Array.isArray(users.data)) {
            for (let user of users.data) {
                if (userId === user.id) {
                    return user;
                }
            }
        }
        return userId;
    };

    const getPanelName = (panelId) => {
        for (let panel of panelFilter) {
            if (panel.id === panelId) {
                return panel?.label;
            }
        }

        return "Unknown Panel";
    };

    const getURL = (panelId) => {
        let url = `/api/system/logs`;
        if (panelId) {
            url += `/${panelId}`;
        }
        return url;
    };

    const getColumns = (user, users) => {
        const columns = [
            {
                title: "Time",
                hideWidth: 1024,
                width: 220,
                sortable: true,
                field: "timestamp",
                filterType: "dropdown",
                filterOptions: [
                    { label: "View all items", id: "" },
                    { label: "Last 5 minutes", id: 300 },
                    { label: "Last 30 minutes", id: 1800 },
                    { label: "Last hour", id: 3600 },
                    { label: "Last 2 hours", id: 7200 },
                ],
                content: (item) => <>{item.timestamp}</>,
            },
            {
                title: "Level",
                width: 150,
                hideWidth: 512,
                field: "level",
                filterType: "dropdown",
                filterOptions: [
                    { label: "All logs", id: "" },
                    { label: "Error", id: "error" },
                    { label: "Warning", id: "warning" },
                    { label: "Info", id: "info" },
                    { label: "Debug", id: "debug" },
                ],
                sortable: true,
                content: (item) => {
                    return <>{item.level}</>;
                },
            },
            {
                title: "Message",
                sortable: false,
                field: "message",
                filterType: "text",
                content: (item) => <>{item.message}</>,
            },
            {
                title: "Panel",
                sortable: false,
                field: "meta",
                filterType: "dropdown",
                filterOptions: panelFilter,
                content: (item) => {
                    if (item.meta.panelId) {
                        return <BugChipDisplay options={[getPanelName(item.meta.panelId)]} />;
                    }
                },
            },
        ];

        if (user) {
            columns.push({
                title: "User",
                sortable: false,
                field: "meta",
                filterType: "dropdown",
                filterOptions: panelFilter,
                content: (item) => {
                    if (item.meta.userId) {
                        const user = getUser(item.meta.userId);
                        return (
                            <BugChipDisplay
                                avatar={<Avatar alt={user?.name} src={getGravatarUrl(user?.email)} />}
                                options={[user?.name]}
                            />
                        );
                    }
                },
            });
        }

        return columns;
    };

    if (panelFilter.status === "loading" || currentUser.status === "loading" || users.status === "loading") {
        return <BugLoading />;
    }

    return (
        <BugApiTable
            columns={getColumns(currentUser.data)}
            defaultSortIndex={0}
            defaultSortDirection="desc"
            apiUrl={getURL(panelId)}
            noData={<BugNoData panelId={panelId} title="No logs found" showConfigButton={false} />}
            sortable
            filterable
        />
    );
}

LogTable.defaultProps = {
    level: "info",
    panelId: "",
    interval: 1000,
};

LogTable.propTypes = {
    level: PropTypes.string,
    panelId: PropTypes.string,
    interval: PropTypes.number,
};
