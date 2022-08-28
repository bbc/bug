import React from "react";
import { Bar, AreaChart, Area, ComposedChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import Box from "@mui/material/Box";
import { useApiPoller } from "@hooks/ApiPoller";
import { format } from "date-fns";
import { useInterval } from "@hooks/Interval";
import TimeAgo from "javascript-time-ago";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        let timestamp = payload[0].payload.timestamp;
        return (
            <Box sx={{ padding: "0.5rem", backgroundColor: "background.default", color: "rgba(255, 255, 255, 0.5)" }}>
                <div>
                    <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                        TIME:
                    </Box>
                    {format(timestamp, "kk:mm:ss")}
                </div>
                <div>
                    <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                        LOSS:
                    </Box>
                    {payload[0].payload.frameLossRate} %
                </div>
                <div>
                    <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                        ERROR CORRECTION:
                    </Box>
                    {payload[0].payload.corrUpRate} %
                </div>
            </Box>
        );
    }

    return null;
};

export default function DelayChart({ panelId }) {
    const [range, setRange] = React.useState(null);
    const timeAgo = new TimeAgo("en-GB");

    const stats = useApiPoller({
        url: `/container/${panelId}/statistics/history`,
        interval: 1000,
    });

    useInterval(() => {
        setRange([Date.now() - 120000, Date.now()]);
    }, 1000);

    if (!stats?.data || stats?.data.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                margin: "16px",
            }}
        >
            <Box
                sx={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    textAlign: "center",
                }}
            >
                Loss and Error Correction
            </Box>

            <ResponsiveContainer width="100%" height={200}>
                <ComposedChart
                    height={250}
                    data={stats.data}
                    margin={{
                        top: 10,
                        right: 0,
                        bottom: 0,
                        left: 10,
                    }}
                >
                    <XAxis
                        dataKey="timestamp"
                        interval={80}
                        scale="time"
                        tickFormatter={(value) => {
                            return timeAgo.format(parseInt(value));
                        }}
                        type="number"
                        domain={range}
                    />
                    <YAxis
                        type="number"
                        domain={[0, 100]}
                        tickCount={4}
                        tickFormatter={(value) => {
                            return `${parseInt(value)}%`;
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar isAnimationActive={false} dataKey="frameLossRate" fill="#dd3124" />
                    <Line strokeWidth={3} isAnimationActive={false} dataKey="corrUpRate" dot={false} stroke="#1e1ba2" />
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
}
