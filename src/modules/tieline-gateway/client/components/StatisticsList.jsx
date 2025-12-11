import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import BugPowerIcon from "@core/BugPowerIcon";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import StateLabel from "./StateLabel";

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

    const formatStat = (value, activeColor) => {
        if (value === undefined) {
            return <Box sx={{ color: "text.secondary" }}>-</Box>;
        } else if (parseInt(value) > 0) {
            return <Box sx={{ fontWeight: 500, color: activeColor }}>{value}</Box>;
        }
        return <Box sx={{ color: "text.secondary" }}>0</Box>;
    };

    const formatStats = (stats1m, stats10m, statsTotal, activeColor = "text.primary") => {
        return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ margin: "0 4px" }}>
                    <StatsLabel>1 min</StatsLabel>
                    <StatsValue>{formatStat(stats1m, activeColor)}</StatsValue>
                </Box>
                <Box sx={{ margin: "0 4px" }}>
                    <StatsLabel>10 min</StatsLabel>
                    <StatsValue>{formatStat(stats10m, activeColor)}</StatsValue>
                </Box>
                <Box sx={{ margin: "0 4px" }}>
                    <StatsLabel>Total</StatsLabel>
                    <StatsValue>{formatStat(statsTotal, activeColor)}</StatsValue>
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
                    content: (item) =>
                        item.type === "connection" && <BugPowerIcon disabled={item.state !== "Connected"} />,
                },
                {
                    width: "190px",
                    title: "Connection",
                    hideWidth: 1080,
                    content: (item) => (
                        <>
                            {item.type === "group" && <Box sx={{ fontWeight: 500 }}>{item?.name}</Box>}
                            {item.type === "connection" && (
                                <Box sx={{ color: "text.secondary" }}>
                                    {item?._tabName} - {item?.via}
                                </Box>
                            )}
                        </>
                    ),
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
                                item["stats-total"]?.["loss"],
                                item.type === "group" ? "error.main" : "text.primary"
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
                                item["stats-total"]?.["empty"],
                                item.type === "group" ? "error.main" : "text.primary"
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
                                item["stats-total"]?.["late"],
                                item.type === "group" ? "error.main" : "text.primary"
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
                                item["stats-total"]?.["fec"],
                                item.type === "group" ? "error.main" : "text.primary"
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
