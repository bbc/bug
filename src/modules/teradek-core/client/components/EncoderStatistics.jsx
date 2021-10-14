import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useWindowSize } from "@utils/WindowSize";
import moment from "moment";

export default function EncoderStatistics({ encoder, panelId }) {
    const windowSize = useWindowSize();
    const theme = useTheme();

    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        if (encoder?.encoderStatsVideo) {
            let newData = encoder?.encoderStatsVideo.filter((item) => {
                if (item?.bitrate_out && item?.bitrate && item?.timestamp) {
                    return true;
                }
                return false;
            });

            newData = newData.map((item) => {
                return {
                    Time: Date.parse(item?.timestamp) * 1000,
                    Bitrate: item?.bitrate_out,
                    Wired: item?.bitrate,
                };
            });

            newData = newData.sort(function (a, b) {
                return a.timestamp - b.timestamp;
            });

            setGraphData(newData);
        }
    }, [encoder]);

    const chartHeight = windowSize.height < 650 ? windowSize.height - 200 : 450;

    return (
        <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart
                data={graphData}
                margin={{
                    top: 30,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    label="Time"
                    domain={[graphData[0]?.timestamp, graphData[graphData?.length - 1]?.timestamp]}
                    dataKey="Time"
                    tickFormatter={(unixTime) => moment(Math.round(unixTime / 1000)).format("HH:mm Do")}
                    type="number"
                />
                <YAxis label="bps" />
                <Tooltip />
                <Legend />
                <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="Wired"
                    stroke={theme.palette.error.main}
                    dot={false}
                />
                <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="Bitrate"
                    stroke={theme.palette.success.main}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
