import React from "react";
import { ComposedChart, Line, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import Box from "@mui/material/Box";
import { format } from "date-fns";
import { useInterval } from "@hooks/Interval";
import TimeAgo from "javascript-time-ago";

const CustomTooltip = ({ active, payload, type }) => {
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
                        LEFT:
                    </Box>
                    {payload[0].payload[`${type}-left`]}
                </div>
                <div>
                    <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                        RIGHT:
                    </Box>
                    {payload[0].payload[`${type}-right`]}
                </div>
            </Box>
        );
    }

    return null;
};

export default function AudioChart({ stats, type }) {
    const [range, setRange] = React.useState(null);
    const timeAgo = new TimeAgo("en-GB");

    useInterval(() => {
        setRange([Date.now() - 120000, Date.now()]);
    }, 500);

    React.useEffect(() => {
        setRange([Date.now() - 120000, Date.now()]);
    }, []);

    if (!stats || stats?.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                "& .recharts-wrapper": {
                    position: "absolute !important",
                },
            }}
        >
            <ResponsiveContainer width="100%" height={200}>
                <ComposedChart
                    height={250}
                    data={stats}
                    margin={{
                        top: 0,
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
                            return timeAgo.format(parseInt(value), "mini");
                        }}
                        type="number"
                        domain={range}
                        dy={10}
                    />
                    <YAxis tickCount={0} domain={[0, 72]} width={10} />
                    <Tooltip content={<CustomTooltip type={type} />} />
                    <Line isAnimationActive={false} dot={false} dataKey={`${type}-left`} stroke="#245cb2" />
                    <Line isAnimationActive={false} dot={false} dataKey={`${type}-right`} stroke="#7ca0cb" />
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
}
