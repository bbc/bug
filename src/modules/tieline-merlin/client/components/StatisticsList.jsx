import React from "react";
import BugApiTable from "@core/BugApiTable";
import BugPowerIcon from "@core/BugPowerIcon";
import StateLabel from "./StateLabel";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import BugNoData from "@core/BugNoData";

export default function StatisticsList({ panelId }) {
    const StatsLabel = styled("div")(({ theme }) => ({
        display: "inline-block",
        color: theme.palette.primary.main,
        width: "3rem",
    }));
    const StatsValue = styled("div")(({ theme }) => ({
        display: "inline-block",
        padding: "0 4px",
        width: "60px",
        textAlign: "center",
    }));

    const formatStats = (stats1m, stats10m, statsTotal) => {
        return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ margin: "0 4px" }}>
                    <StatsLabel>1 min</StatsLabel>
                    <StatsValue>{stats1m !== undefined ? stats1m : "-"}</StatsValue>
                </Box>
                <Box sx={{ margin: "0 4px" }}>
                    <StatsLabel>10 min</StatsLabel>
                    <StatsValue>{stats10m !== undefined ? stats10m : "-"}</StatsValue>
                </Box>
                <Box sx={{ margin: "0 4px" }}>
                    <StatsLabel>Total</StatsLabel>
                    <StatsValue>{statsTotal !== undefined ? statsTotal : "-"}</StatsValue>
                </Box>
            </Box>
        );
    };

    return (
        <BugApiTable
            columns={[
                {
                    noPadding: true,
                    hideWidth: 700,
                    width: 44,
                    content: (item) => <BugPowerIcon disabled={item.state !== "Connected"} />,
                },
                {
                    width: "60px",
                    minWidth: "60px",
                    noWrap: true,
                    title: "Name",
                    content: (item) => item?._tabName,
                },
                {
                    width: "130px",
                    title: "Group",
                    hideWidth: 1080,
                    content: (item) => item?._group,
                },
                {
                    noWrap: true,
                    width: "150px",
                    minWidth: "150px",
                    hideWidth: 844,
                    title: "Destination",
                    content: (item) => (
                        <>
                            {item?.destination && (
                                <Box>
                                    {item?.destination}:{item?.audioPort}
                                </Box>
                            )}
                        </>
                    ),
                },
                {
                    noWrap: true,
                    title: "State",
                    content: (item) => <StateLabel state={item.state} showValues={false} />,
                },
                {
                    noWrap: true,
                    title: "Loss",
                    content: (item) => (
                        <>
                            {formatStats(
                                item["stats-1m"]?.["loss"],
                                item["stats-10m"]?.["loss"],
                                item["stats-total"]?.["loss"]
                            )}
                        </>
                    ),
                },
                {
                    noWrap: true,
                    title: "Empty",
                    hideWidth: 1400,
                    content: (item) => (
                        <>
                            {formatStats(
                                item["stats-1m"]?.["empty"],
                                item["stats-10m"]?.["empty"],
                                item["stats-total"]?.["empty"]
                            )}
                        </>
                    ),
                },
                {
                    noWrap: true,
                    title: "Late",
                    hideWidth: 1240,
                    content: (item) => (
                        <>
                            {formatStats(
                                item["stats-1m"]?.["late"],
                                item["stats-10m"]?.["late"],
                                item["stats-total"]?.["late"]
                            )}
                        </>
                    ),
                },
                {
                    noWrap: true,
                    title: "FEC",
                    hideWidth: 680,
                    content: (item) => (
                        <>
                            {formatStats(
                                item["stats-1m"]?.["fec"],
                                item["stats-10m"]?.["fec"],
                                item["stats-total"]?.["fec"]
                            )}
                        </>
                    ),
                },
            ]}
            apiUrl={`/container/${panelId}/connection/statistics/`}
            panelId={panelId}
            hideHeader={false}
            rowHeight="62px"
            sortable
            refreshInterval={2000}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No connection statistics found"
                    message="Click to edit panel configuration"
                    showConfigButton={true}
                />
            }
        />
    );
}
