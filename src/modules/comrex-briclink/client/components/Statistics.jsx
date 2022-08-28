import React from "react";
import { useApiPoller } from "@hooks/ApiPoller";
import BugDetailsCard from "@core/BugDetailsCard";
import formatBps from "@utils/format-bps";

export default function InterfaceTabDetails({ panelId, interfaceId }) {
    const stats = useApiPoller({
        url: `/container/${panelId}/statistics/`,
        interval: 5000,
    });

    return (
        <BugDetailsCard
            elevation={0}
            items={[
                { name: "Remote Unit", value: stats.data?.name ? stats.data?.name : "NOT CONNECTED" },
                { name: "Duration", value: stats.data?.callTime ? `${stats.data?.callTime} seconds` : "" },
                { name: "RX Rate", value: stats.data?.effRxBitrate ? formatBps(stats.data?.effRxBitrate) : "" },
                { name: "RX Overhead", value: stats.data?.rxOverhead ? formatBps(stats.data?.rxOverhead) : "" },
                { name: "RX Delay", value: stats.data?.delayIn ? `${stats.data?.delayIn} ms` : "" },
                { name: "TX Rate", value: stats.data?.effTxBitrate ? formatBps(stats.data?.effTxBitrate) : "" },
                { name: "TX Overhead", value: stats.data?.txOverhead ? formatBps(stats.data?.txOverhead) : "" },
                { name: "TX Delay", value: stats.data?.delayOut ? `${stats.data?.delayOut} ms` : "" },
                {
                    name: "Frame Loss",
                    value:
                        stats.data?.frameLossRate !== null && stats.data?.frameLossRate !== undefined
                            ? `${stats.data?.frameLossRate}%`
                            : "",
                },
                {
                    name: "Remote Loss",
                    value:
                        stats.data?.remoteLoss !== null && stats.data?.remoteLoss !== undefined
                            ? `${stats.data?.remoteLoss}%`
                            : "",
                },
            ]}
        />
    );
}
