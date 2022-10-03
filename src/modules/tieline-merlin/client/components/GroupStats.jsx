import React from "react";
import BugDetailsTable from "@core/BugDetailsTable";
import { useApiPoller } from "@hooks/ApiPoller";
import formatBps from "@utils/format-bps";
import { useSelector } from "react-redux";

export default function GroupStats({ group, panelId }) {
    const panelConfig = useSelector((state) => state.panelConfig);
    const showAdvanced = panelConfig && panelConfig.data.showAdvanced;

    const stats = useApiPoller({
        url: `/container/${panelId}/group/statistics/${encodeURIComponent(group.id)}`,
        interval: 1000,
    });

    const bufferTypes = {
        A: "Auto",
        F: "Fixed",
    };

    return (
        <BugDetailsTable
            sx={{
                "& .MuiTableCell-root": {
                    height: "66px",
                },
            }}
            width="12rem"
            items={[
                {
                    name: "Jitter buffer",
                    value: stats?.data?.["jitter-buffer"].delay ? `${stats?.data?.["jitter-buffer"].delay} ms` : "",
                },
                showAdvanced && {
                    name: "Jitter buffer type",
                    value: bufferTypes[stats?.data?.["jitter-buffer"].state]
                        ? bufferTypes[stats?.data?.["jitter-buffer"].state]
                        : "",
                },
                {
                    name: "TX bitrate",
                    value:
                        stats?.data?.["tx-bitrate"] !== undefined
                            ? formatBps(parseInt(stats?.data?.["tx-bitrate"]))
                            : "",
                },
                {
                    name: "RX bitrate",
                    value:
                        stats?.data?.["rx-bitrate"] !== undefined
                            ? formatBps(parseInt(stats?.data?.["rx-bitrate"]))
                            : "",
                },
                showAdvanced && {
                    name: "Connected",
                    value: stats?.data?.["_time"],
                },
                showAdvanced && {
                    name: "Total lost packets",
                    value: stats?.data?.["total-aggregate"]?.["loss"],
                },
            ]}
        />
    );
}
