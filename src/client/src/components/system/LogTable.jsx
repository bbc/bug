import React from "react";
import PropTypes from "prop-types";
import BugApiTable from "@core/BugApiTable";
import BugChipDisplay from "@core/BugChipDisplay";
import { useSelector } from "react-redux";

export default function LogTable({ panelId, level, interval }) {
    const panelFilter = useSelector((state) =>
        state.panelList.data.map((item) => {
            return { label: item.title, id: item.id };
        })
    );

    return (
        <BugApiTable
            columns={[
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
                        { label: "Action", id: "action" },
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
                    title: "Tags",
                    sortable: false,
                    field: "meta",
                    filterType: "dropdown",
                    filterOptions: panelFilter,
                    content: (item) => {
                        if (item.meta) {
                            return <BugChipDisplay options={Object.values(item.meta)} />;
                        }
                    },
                },
            ]}
            defaultSortIndex={0}
            defaultSortDirection="desc"
            apiUrl={`/api/system/logs/1`}
            sortable
            filterable
        />
    );
}

LogTable.defaultProps = {
    level: "info",
    interval: 1000,
};

LogTable.propTypes = {
    level: PropTypes.string,
    interval: PropTypes.number,
};
