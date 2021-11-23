import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer } from "recharts";
import { useWindowSize } from "@utils/WindowSize";
import hslToHex from "@utils/hslToHex";
import { useSelector } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(async (theme) => ({
    label: {
        color: theme.palette.secondary.main,
    },
}));

export default function ChartCPU({ containers, stats, showTitle }) {
    const classes = useStyles();
    const windowSize = useWindowSize();
    const panelList = useSelector((state) => state.panelList);
    const data = stats.map((rawData) => {
        const datapoint = {
            timestamp: Date.parse(rawData?.timestamp) * 1000,
        };

        for (let container of rawData?.containers) {
            datapoint[container?.id] = container?.cpuPercent;
        }
        return datapoint;
    });

    const getTitle = (id) => {
        if (panelList.status === "success") {
            for (let panel of panelList.data) {
                if (panel?._dockerContainer?.containerid === id) {
                    return panel?.title;
                }
            }
        }
        if (containers.status === "success") {
            for (let container of containers.data) {
                if (container?.containerid === id) {
                    return container?.name;
                }
            }
        }
        return id;
    };

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
                        name={getTitle(key)}
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="1"
                        stroke={color}
                        fill={color}
                        unit="%"
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
                {getHeader("CPU Usage")}
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
                                <Label className={classes.label} value="Percentage (%)" angle="-90" />
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

ChartCPU.defaultProps = {
    showTitle: false,
};

ChartCPU.propTypes = {
    showTitle: PropTypes.bool,
};
