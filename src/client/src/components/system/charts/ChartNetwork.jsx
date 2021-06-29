import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useWindowSize } from "@utils/WindowSize";
import hslToHex from "@utils/hslToHex";
import moment from "moment";

export default function ChartNetworkRx({ type, stats }) {
    const windowSize = useWindowSize();

    const data = stats.map((rawData) => {
        const datapoint = {
            timestamp: rawData?.timestamp,
        };

        for (let iface of rawData?.network) {
            datapoint[`${iface?.iface} (Total)`] = iface[`${type}_bytes`];
            datapoint[`${iface?.iface} (Dropped)`] = iface[`${type}_dropped`];
            datapoint[`${iface?.iface} (Errors)`] = iface[`${type}_errors`];
        }
        return datapoint;
    });

    const getSeries = (datapoint, xDataKey) => {
        const count = Object.keys(datapoint).length;
        let current = 1;
        const series = [];
        for (const key in datapoint) {
            if (key !== xDataKey) {
                const color = hslToHex(208, 57, Math.round((current / count) * 100));
                series.push(
                    <Area name={key} key={key} type="monotone" dataKey={key} stackId="1" stroke={color} fill={color} />
                );
                current++;
            }
        }
        return series;
    };

    const chartHeight = windowSize.height < 650 ? windowSize.height - 200 : 450;

    return (
        <>
            <Card>
                <CardHeader title={`Network ${type.toUpperCase()} Data`}></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                label="Time"
                                domain={[data[data.length - 1]?.timestamp, data[data?.length - 1]?.timestamp]}
                                dataKey="timestamp"
                                tickFormatter={(unixTime) => moment(Math.round(unixTime / 1000)).format("HH:mm Do")}
                                type="number"
                            />
                            <YAxis />
                            <Tooltip />
                            {getSeries(data[0], "timestamp")}
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
}
