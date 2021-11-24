import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { useWindowSize } from "@utils/WindowSize";
import hslToHex from "@utils/hslToHex";
import moment from "moment";
import PropTypes from "prop-types";

export default function ChartNetwork({ type, stats, showTitle }) {
    const windowSize = useWindowSize();

    const data = stats.map((rawData) => {
        const datapoint = {
            timestamp: Date.parse(rawData?.timestamp) * 1000,
        };

        for (let iface of rawData?.network) {
            datapoint[`${iface?.iface} (Total)`] = iface[`${type}_bytes`] / 1000000;
            datapoint[`${iface?.iface} (Dropped)`] = iface[`${type}_dropped`] / 1000000;
            datapoint[`${iface?.iface} (Errors)`] = iface[`${type}_errors`] / 1000000;
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
                    <Area
                        unit="MB"
                        name={key}
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="1"
                        stroke={color}
                        fill={color}
                    />
                );
                current++;
            }
        }
        return series;
    };

    const tooltipFormatter = (value, name) => {
        return Math.round(value * 10) / 10;
    };

    const getHeader = (title) => {
        if (showTitle) {
            return <CardHeader title={title}></CardHeader>;
        }
        return null;
    };

    const chartHeight = windowSize.height < 650 ? windowSize.height - 200 : 450;

    return (
        <>
            <Card>
                {getHeader(`Network ${type.toUpperCase()} Data`)}
                <CardContent>
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 10,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                domain={[data[data.length - 1]?.timestamp, data[data?.length - 1]?.timestamp]}
                                dataKey="timestamp"
                                tickFormatter={(unixTime) => moment(Math.round(unixTime / 1000)).format("HH:mm Do")}
                                type="number"
                            >
                                <Label
                                    sx={{
                                        color: "secondary.main",
                                        opacity: 0.5,
                                    }}
                                    value="Time"
                                    position="bottom"
                                    offset={0}
                                />
                            </XAxis>
                            <YAxis>
                                <Label
                                    sx={{
                                        color: "secondary.main",
                                        opacity: 0.5,
                                    }}
                                    value="Data Troughput (KB)"
                                    angle="-90"
                                />
                            </YAxis>
                            <YAxis />
                            <Tooltip formatter={tooltipFormatter} />
                            {getSeries(data[0], "timestamp")}
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
}

ChartNetwork.defaultProps = {
    showTitle: false,
};

ChartNetwork.propTypes = {
    showTitle: PropTypes.bool,
};
