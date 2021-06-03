import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useWindowSize } from "@utils/WindowSize";

export default function EncoderStatistics({ encoder, panelId }) {
    const windowSize = useWindowSize();

    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        console.log(encoder);
        if (encoder?.videoHistory) {
            let newData = encoder?.videoHistory.filter((item) => {
                if (item?.bitrate_out && item?.bitrate && item?.ts) {
                    return true;
                }
                return false;
            });

            newData = newData.map((item) => {
                return {
                    timestamp: item?.ts,
                    tx: item?.bitrate_out,
                    rx: item?.bitrate,
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
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    domain={[
                        graphData[0]?.timestamp,
                        graphData[graphData?.length - 1]?.timestamp,
                    ]}
                    dataKey="timestamp"
                    type="number"
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tx" stroke="#55ca9d" />
                <Line type="monotone" dataKey="rx" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
}
