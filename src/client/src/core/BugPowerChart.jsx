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

const CustomTooltip = ({ active, payload, label, receiverCount, units }) => {
    // GH - moved this into separate section - and added receiverCount to the props.
    // I don't know if this'll work - needs testing. Sorry!

    if (active && payload && payload.length) {
        let timestamp = payload[0].payload.timestamp;

        const getTooltipValues = () => {
            const lines = [
                <div key="timestamp">
                    <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                        TIME:
                    </Box>
                    {format(timestamp, "kk:mm:ss")}
                </div>,
            ];

            for (let receiver in payload[0].payload) {
                if (receiver !== "timestamp" && parseInt(receiver) <= parseInt(receiverCount)) {
                    lines.push(
                        <div key={receiver}>
                            <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                                {receiver}:
                            </Box>
                            {` ${Math.round(payload[0].payload[receiver] * 100) / 100} ${units}`}
                        </div>
                    );
                }
            }
            return lines;
        };

        return (
            <Box sx={{ padding: "0.5rem", backgroundColor: "background.default", color: "rgba(255, 255, 255, 0.5)" }}>
                {getTooltipValues()}
            </Box>
        );
    }

    return null;
};

export default function BugPowerChart({
    yRange = [0, "auto"],
    receiverCount = 4,
    url,
    units = "dBm",
    mockApiData = null,
    sx = {},
}) {
    const rangeSpan = 10;
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

    const getSeries = () => {
        const series = [];

        for (let receiver in stats[stats.length - 1]) {
            const color = hslToHex(208, 57, Math.round((receiver / receiverCount) * 100));

            if (receiver !== "timestamp" && parseInt(receiver) <= parseInt(receiverCount)) {
                series.push(<Line key={receiver} type="monotone" dataKey={receiver} stroke={color} dot={false} />);
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
                ...sx,
            }}
        >
            <ResponsiveContainer width="100%" height={chartHeight}>
                <ComposedChart barGap={1} data={stats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={range}
                        tickCount={5}
                        tickFormatter={(value) => {
                            return format(value, "kk:mm");
                        }}
                    />
                    <YAxis
                        domain={yRange}
                        tickFormatter={(value) => {
                            return `${value} ${units}`;
                        }}
                        width={80}
                    />
                    {getSeries()}
                    {/* Here it is: the extra prop - GH */}
                    <Tooltip content={<CustomTooltip receiverCount={receiverCount} units={units} />} />
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
                    onClick={() => handleBack(5)}
                    startIcon={<ArrowLeftIcon />}
                >
                    5 min
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
                    onClick={() => handleForward(5)}
                    endIcon={<ArrowRightIcon />}
                >
                    5 min
                </Button>
            </Box>
        </Box>
    );
}
