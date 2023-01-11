import React from "react";
import BugApiTable from "@core/BugApiTable";
import BugSparkCell from "@core/BugSparkCell";
import Box from "@mui/material/Box";
import BugStatusLabel from "@core/BugStatusLabel";

export default function SystemHealthHost() {
    return (
        <BugApiTable
            columns={[
                {
                    title: "Name",
                    field: "active",
                    sortable: true,
                    content: (item) => {
                        return (
                            <>
                                <Box>{item.name}</Box>
                                <BugStatusLabel
                                    sx={{
                                        color: item.type === "panel" ? "text.primary" : "text.secondary",
                                    }}
                                >
                                    {item.module}
                                </BugStatusLabel>
                            </>
                        );
                    },
                },
                {
                    title: "CPU",
                    sortable: false,
                    field: "cpu",
                    content: (item) => {
                        const value = `${item.cpu_percent}%`;
                        const history =
                            item?.cpu_history &&
                            item?.cpu_history?.map((a) => {
                                return {
                                    value: a,
                                };
                            });
                        return <BugSparkCell showEmpty value={value} history={history} height={40} />;
                    },
                },
                {
                    title: "Memory Used / Limit",
                    hideWidth: 798,
                    sortable: true,
                    field: "memory.used",
                    content: (item) => `${item.memory.used_text} / ${item.memory.total_text}`,
                },
                {
                    title: "Network I/O",
                    hideWidth: 1024,
                    content: (item) => {
                        const value = `${item.network.rx_text} / ${item.network.tx_text}`;
                        const history =
                            item?.network_history &&
                            item?.network_history.map((a) => {
                                return {
                                    value: a,
                                };
                            });
                        return <BugSparkCell showEmpty value={value} history={history} height={40} />;
                    },
                },
                {
                    title: "Disk I/O",
                    hideWidth: 1200,
                    content: (item) => {
                        const value = `${item.disk.r_text} / ${item.disk.w_text}`;
                        const history = item.disk_history.map((a) => {
                            return {
                                value: a,
                            };
                        });
                        return <BugSparkCell showEmpty value={value} history={history} height={40} />;
                    },
                },
            ]}
            apiUrl={`/api/system/containerhealth`}
            defaultSortDirection="asc"
            defaultSortIndex={3}
            hideHeader={false}
            rowHeight="48px"
            sortable
        />
    );
}
