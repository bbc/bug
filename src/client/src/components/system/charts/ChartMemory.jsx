import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { useWindowSize } from "@utils/WindowSize";
import hslToHex from "@utils/hslToHex";
import moment from "moment";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    label: {
        color: theme.palette.secondary.main,
        opacity: 0.5,
    },
}));

export default function ChartMemory({ stats, showTitle }) {
    const classes = useStyles();
    const windowSize = useWindowSize();
    const factor = 0.00000095367432;

    const data = stats.map((rawData) => {
        return {
            timestamp: Date.parse(rawData?.timestamp) * 1000,
            used: Math.round(rawData?.memory?.used * factor),
            free: Math.round(rawData?.memory?.free * factor),
        };
    });

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
                {getHeader("Memory Usage")}
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
                                <Label className={classes.label} value="Time" position="bottom" offset={0} />
                            </XAxis>
                            <YAxis>
                                <Label className={classes.label} value="Memory (GB)" angle="-90" />
                            </YAxis>
                            <Tooltip formatter={tooltipFormatter} />
                            <Area
                                name={"Used Memory"}
                                type="monotone"
                                dataKey={"used"}
                                stackId="1"
                                stroke={hslToHex(208, 57, 40)}
                                fill={hslToHex(208, 57, 40)}
                                unit="MB"
                            />
                            <Area
                                name={"Free Memory"}
                                type="monotone"
                                dataKey={"free"}
                                stackId="1"
                                stroke={hslToHex(208, 57, 20)}
                                fill={hslToHex(208, 57, 20)}
                                unit="Mb"
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
