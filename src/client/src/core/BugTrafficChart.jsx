import React, { useState, useRef, useEffect, useCallback } from "react";
import formatBps from "@utils/format-bps";
import { format } from "date-fns";
import { ComposedChart, Area, Bar, XAxis, Legend, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import { TimePicker } from "@material-ui/pickers";
import { useWindowSize } from "@utils/WindowSize";

export default function BugTrafficChart({ url, type }) {
    const rangeSpan = 10;
    const initialRange = [Date.now() - rangeSpan * 60000, Date.now()];
    const timer = useRef();
    const windowSize = useWindowSize();

    const [enableAutoRefresh, setEnableAutoRefresh] = useState(true);
    const [range, setRange] = useState(initialRange);
    const [stats, setStats] = useState(null);

    const doAutoRefresh = useCallback(() => {
        setRange([Date.now() - rangeSpan * 60000, Date.now()]);
        timer.current = setTimeout(doAutoRefresh, 5000);
    }, []);

    useAsyncEffect(async () => {
        const fetchedStats = await AxiosGet(`${url}/${range[0]}/${range[1]}`);
        // for (let eachStat of fetchedStats) {
        //     eachStat["rx"] = eachStat["rx"] * -1;
        // }
        setStats(fetchedStats);
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
        if (type === "area") {
            return (
                <>
                    <Area isAnimationActive={false} type="monotone" dataKey="tx" fill="#337ab7" stroke="#337ab7" />
                    <Area isAnimationActive={false} type="monotone" dataKey="rx" fill="#bb2828" stroke="#bb2828" />
                </>
            );
        }
        return (
            <>
                <Bar isAnimationActive={false} dataKey="tx" fill="#337ab7" />
                <Bar isAnimationActive={false} dataKey="rx" fill="#bb2828" />
            </>
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let timestamp = payload[0].payload.timestamp;
            let tx = payload[0].payload.tx;
            let rx = payload[0].payload.rx;
            return (
                <Box
                    sx={{ padding: "0.5rem", backgroundColor: "background.default", color: "rgba(255, 255, 255, 0.5)" }}
                >
                    <div>
                        <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                            TIME:
                        </Box>
                        {format(timestamp, "kk:mm:ss")}
                    </div>
                    <div>
                        <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                            TX BITRATE:
                        </Box>
                        {formatBps(tx)}
                    </div>
                    <div>
                        <Box component="span" sx={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
                            RX BITRATE:
                        </Box>
                        {formatBps(rx)}
                    </div>
                </Box>
            );
        }

        return null;
    };

    const chartHeight = windowSize.height < 650 ? windowSize.height - 200 : 450;

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
                    <Area isAnimationActive={false} type="monotone" dataKey="tx" fill="#337ab7" stroke="#337ab7" />
                    <Area isAnimationActive={false} type="monotone" dataKey="rx" fill="#bb2828" stroke="#bb2828" />
                    <Legend
                        width={70}
                        layout="vertical"
                        wrapperStyle={{
                            top: "20px",
                            right: "20px",
                            backgroundColor: "#333",
                            border: "1px solid #333",
                            borderRadius: "3px",
                            lineHeight: "40px",
                            opacity: 0.8,
                        }}
                        formatter={(value) => {
                            return value.toUpperCase();
                        }}
                    />
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
                        tickFormatter={(value) => {
                            return formatBps(value, 0);
                        }}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </ComposedChart>
            </ResponsiveContainer>
            <Box
                sx={{
                    textAlign: "center",
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

                <TimePicker ampm={false} sx={{ margin: "8px" }} value={range[1]} onChange={handleTimePickerChange} />

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
