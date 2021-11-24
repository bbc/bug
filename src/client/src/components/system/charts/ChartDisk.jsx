import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer } from "recharts";
import { useWindowSize } from "@utils/WindowSize";
import hslToHex from "@utils/hslToHex";
import moment from "moment";
import PropTypes from "prop-types";

export default function ChartDisk({ stats, showTitle }) {
    const windowSize = useWindowSize();
    const factor = 0.0000000095367432;
    const units = "GB";
    let disksSize = 0;

    for (let disk of stats[0].disks) {
        disksSize = disksSize + Math.round(disk?.size * factor);
    }

    const data = stats.map((rawData) => {
        const datapoint = {
            timestamp: Date.parse(rawData?.timestamp) * 1000,
        };

        for (let disk of rawData?.disks) {
            datapoint[disk?.fs] = Math.round(disk?.used * factor);
        }
        return datapoint;
    });

    const tooltipFormatter = (value, name) => {
        return Math.round(value * 10) / 10;
    };

    const getSeries = (datapoint, xDataKey) => {
        const count = Object.keys(datapoint).length;
        let current = 1;
        const series = [];
        for (const key in datapoint) {
            if (key !== xDataKey) {
                const color = hslToHex(208, 57, Math.round((current / count) * 100));
                series.push(
                    <Area
                        unit={units}
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
                {getHeader("Disk Space")}
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
                            <YAxis domain={[0, disksSize]}>
                                <Label
                                    sx={{
                                        color: "secondary.main",
                                        opacity: 0.5,
                                    }}
                                    value="Disk Usage (GB)"
                                    angle="-90"
                                />
                            </YAxis>
                            <Tooltip formatter={tooltipFormatter} />
                            {getSeries(data[0], "timestamp")}
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
}

ChartDisk.defaultProps = {
    showTitle: false,
};

ChartDisk.propTypes = {
    showTitle: PropTypes.bool,
};
