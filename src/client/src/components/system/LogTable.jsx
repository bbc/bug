import React from "react";
import PropTypes from "prop-types";
import BugApiTable from "@core/BugApiTable";
import BugTableNoData from "@core/BugTableNoData";

export default function LogTable({ level, interval }) {
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
                        { name: "View all items", value: "" },
                        { name: "Last 5 minutes", value: 300 },
                        { name: "Last 30 minutes", value: 1800 },
                        { name: "Last hour", value: 3600 },
                        { name: "Last 2 hours", value: 7200 },
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
                        { name: "All logs", value: "" },
                        { name: "Error", value: "error" },
                        { name: "Warning", value: "warning" },
                        { name: "Info", value: "info" },
                        { name: "Action", value: "action" },
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
            ]}
            defaultSortIndex={0}
            defaultSortDirection="desc"
            apiUrl={`/api/system/logs/`}
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
