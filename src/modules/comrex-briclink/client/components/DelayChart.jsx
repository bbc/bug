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
                        JITTER:
                    </Box>
                    {payload[0].payload.packetJitter} ms
                </div>
                <div>
                    <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                        DELAY IN:
                    </Box>
                    {payload[0].payload.delayIn} ms
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
                    marginTop: "1rem",
                    textAlign: "center",
                }}
            >
                Delay and Jitter
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
                        tickCount={7}
                        tickFormatter={(value) => {
                            return `${parseInt(value)} ms`;
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar isAnimationActive={false} stackId="a" dataKey="delayIn" fill="#245cb2" />
                    <Bar isAnimationActive={false} stackId="a" dataKey="packetJitter" fill="#7ca0cb" />
                    <Line
                        strokeWidth={2}
                        isAnimationActive={false}
                        dataKey="bufferDesiredDelay"
                        dot={false}
                        stroke="#b5762a"
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
}
