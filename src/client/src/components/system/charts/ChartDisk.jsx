import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useWindowSize } from "@utils/WindowSize";
import hslToHex from "@utils/hslToHex";
import moment from "moment";
import PropTypes from "prop-types";

export default function ChartDisk({ stats, showTitle }) {
    const windowSize = useWindowSize();
    const factor = 0.00000095367432;

    const data = stats.map((rawData) => {
        const datapoint = {
            timestamp: Date.parse(rawData?.timestamp),
        };

        for (let disk of rawData?.disks) {
            datapoint[disk?.fs] = Math.round(disk?.used * factor);
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

ChartDisk.defaultProps = {
    showTitle: false,
};

ChartDisk.propTypes = {
    showTitle: PropTypes.bool,
};
