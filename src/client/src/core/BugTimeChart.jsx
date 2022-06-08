import React, { useState, useRef, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ComposedChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AxiosGet from "@utils/AxiosGet";
import hslToHex from "@utils/hslToHex";
import useAsyncEffect from "use-async-effect";
import { useWindowSize } from "@utils/WindowSize";
import BugTimePicker from "@core/BugTimePicker";

export default function BugTimeChart({ url, units = "ms", mockApiData = null }) {
    const rangeSpan = 60;
    const initialRange = [Date.now() - rangeSpan * 60000, Date.now()];
    const timer = useRef();
    const windowSize = useWindowSize();

    const [enableAutoRefresh, setEnableAutoRefresh] = useState(true);
    const [range, setRange] = useState(initialRange);
    const [stats, setStats] = useState(mockApiData);

    const doAutoRefresh = useCallback(() => {
        setRange([Date.now() - rangeSpan * 60000, Date.now()]);
        timer.current = setTimeout(doAutoRefresh, 5000);
    }, []);

    useAsyncEffect(async () => {
        if (url) {
            const fetchedStats = await AxiosGet(`${url}/${range[0]}/${range[1]}`);
            setStats(fetchedStats);
        }
    }, [url, range]);

    useEffect(() => {
        if (enableAutoRefresh) {
            doAutoRefresh();
        } else {
            clearTimeout(timer.current);
        }
        return () => {
            clearTimeout(timer.current);
        };
    }, [enableAutoRefresh, doAutoRefresh]);

    if (!stats) {
        return null;
    }

    const handleBack = (mins) => {
        setEnableAutoRefresh(false);
        setRange([range[0] - mins * 60000, range[1] - mins * 60000]);
    };

    const handleForward = (mins) => {
        let newEnd = range[1] + mins * 60000;
        if (newEnd > Date.now()) {
            setEnableAutoRefresh(true);
            newEnd = Date.now();
        } else {
            setEnableAutoRefresh(false);
        }
        setRange([newEnd - rangeSpan * 60000, newEnd]);
    };

    const handleLatest = () => {
        setEnableAutoRefresh(true);
    };

    const handleTimePickerChange = (value) => {
        setEnableAutoRefresh(false);
        let newEnd = value.getTime();
        if (newEnd > Date.now()) {
            newEnd = Date.now();
        }
        setRange([newEnd - rangeSpan * 60000, newEnd]);
    };

    const CustomTooltip = ({
        active,
        payload,
        units = { avg: "ms", min: "ms", max: "ms", stddev: "ms", packetLoss: "%" },
    }) => {
        if (active && payload && payload.length > 0) {
            let timestamp = payload[0].payload.timestamp;

            const getTooltipValues = () => {
                const lines = [
                    <div key="timestamp">
                        <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                            TIME:
                        </Box>
                        {` ${format(parseInt(timestamp), "kk:mm")}`}
                    </div>,
                ];

                for (let series in payload[0].payload) {
                    if (series !== "timestamp") {
                        lines.push(
                            <div key={series}>
                                <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                                    {series.toUpperCase()}:
                                </Box>
                                {` ${Math.round(payload[0].payload[series] * 100) / 100}${units[series]}`}
                            </div>
                        );
                    }
                }

                return lines;
            };

            return (
                <Box
                    sx={{ padding: "0.5rem", backgroundColor: "background.default", color: "rgba(255, 255, 255, 0.5)" }}
                >
                    {getTooltipValues()}
                </Box>
            );
        }

        return null;
    };

    const getSeries = () => {
        const series = [];

        for (let key in stats[stats.length - 1]) {
            const color = hslToHex(
                208,
                57,
                Math.round((series.length / Object.keys(stats[stats.length - 1]).length) * 100)
            );

            if (key !== "timestamp") {
                series.push(<Line key={key} type="monotone" dataKey={key} stroke={color} dot={false} />);
            }
        }
        return series;
    };
    const chartHeight = windowSize.height < 650 ? windowSize.height - 200 : 400;

    return (
        <Box
            sx={{
                "& .recharts-legend-item": {
                    marginLeft: "16px",
                },
            }}
        >
            <ResponsiveContainer width="100%" height={chartHeight}>
                <ComposedChart barGap={1} data={stats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    {getSeries()}
                    <XAxis
                        dataKey="timestamp"
                        domain={range}
                        tickCount={5}
                        scale="time"
                        type="number"
                        tickFormatter={(value) => {
                            return format(parseInt(value), "kk:mm");
                        }}
                    />
                    <YAxis
                        tickFormatter={(value) => {
                            return `${value} ${units}`;
                        }}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </ComposedChart>
            </ResponsiveContainer>
            <Box
                sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button
                    sx={{ margin: "8px" }}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleBack(60)}
                    startIcon={<ArrowLeftIcon />}
                >
                    1 hour
                </Button>

                <Button
                    sx={{ margin: "8px" }}
                    variant="contained"
                    color={enableAutoRefresh ? "primary" : "secondary"}
                    onClick={handleLatest}
                    startIcon={<AccessTimeIcon />}
                >
                    Latest
                </Button>

                <BugTimePicker value={range[1]} onChange={handleTimePickerChange} minutesStep={5} />

                <Button
                    sx={{ margin: "8px" }}
                    variant="contained"
                    disabled={enableAutoRefresh}
                    color="secondary"
                    onClick={() => handleForward(60)}
                    endIcon={<ArrowRightIcon />}
                >
                    1 hour
                </Button>
            </Box>
        </Box>
    );
}
