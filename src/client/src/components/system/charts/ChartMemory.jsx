import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useWindowSize } from "@utils/WindowSize";
import hslToHex from "@utils/hslToHex";
import moment from "moment";
import PropTypes from "prop-types";

export default function ChartMemory({ stats, showTitle }) {
    const windowSize = useWindowSize();
    const factor = 0.00000095367432;

    const data = stats.map((rawData) => {
        return {
            timestamp: Date.parse(rawData?.timestamp),
            used: Math.round(rawData?.memory?.used * factor),
            free: Math.round(rawData?.memory?.free * factor),
        };
    });

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
                {getHeader("Memory Usage")}
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
                            <Area
                                name={"Used Memory"}
                                type="monotone"
                                dataKey={"used"}
                                stackId="1"
                                stroke={hslToHex(208, 57, 40)}
                                fill={hslToHex(208, 57, 40)}
                            />
                            <Area
                                name={"Free Memory"}
                                type="monotone"
                                dataKey={"free"}
                                stackId="1"
                                stroke={hslToHex(208, 57, 20)}
                                fill={hslToHex(208, 57, 20)}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
}

ChartMemory.defaultProps = {
    showTitle: false,
};

ChartMemory.propTypes = {
    showTitle: PropTypes.bool,
};
