import React, { useState, useRef, useEffect, useCallback } from "react";
import formatBps from "@core/format-bps";
import { format } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import Button from "@material-ui/core/Button";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import { TimePicker } from "@material-ui/pickers";
import { useWindowSize } from "@utils/WindowSize";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    timePicker: {
        margin: theme.spacing(1),
    },
    toolbar: {
        textAlign: "center",
    },
    tooltip: {
        padding: "0.5rem",
        backgroundColor: theme.palette.background.default,
        color: "rgba(255, 255, 255, 0.5)",
    },
    tooltipName: {
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.7)",
    },
}));

export default function TrafficChart({ url }) {
    const classes = useStyles();
    const rangeSpan = 10;
    const initialRange = [Date.now() - rangeSpan * 60000, Date.now()];
    const timer = useRef();
    const windowSize = useWindowSize();

    const [enableAutoRefresh, setEnableAutoRefresh] = useState(true);
    const [range, setRange] = useState(initialRange);
    const [stats, setStats] = useState(null);

    const doAutoRefresh = useCallback(() => {
        setRange([Date.now() - rangeSpan * 60000, Date.now()]);
        timer.current = setTimeout(doAutoRefresh, 2000);
    }, []);

    useAsyncEffect(async () => {
        setStats(await AxiosGet(`${url}/${range[0]}/${range[1]}`));
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let timestamp = payload[0].payload.timestamp;
            let tx = payload[0].payload.tx;
            let rx = payload[0].payload.rx;
            return (
                <div className={classes.tooltip}>
                    <div>
                        <span className={classes.tooltipName}>TIME:</span> {format(timestamp, "kk:mm:ss")}
                    </div>
                    <div>
                        <span className={classes.tooltipName}>TX BITRATE:</span> {formatBps(tx)}
                    </div>
                    <div>
                        <span className={classes.tooltipName}>RX BITRATE:</span> {formatBps(rx)}
                    </div>
                </div>
            );
        }

        return null;
    };

    const chartHeight = windowSize.height < 650 ? windowSize.height - 200 : 450;

    return (
        <>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart barGap={1} data={stats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Bar isAnimationActive={false} dataKey="tx" fill="#0000ff" />
                    <Bar isAnimationActive={false} dataKey="rx" fill="#ff0000" />
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={range}
                        tickCount={1}
                        tickFormatter={(value) => {
                            return format(value, "kk:mm");
                        }}
                    />
                    <YAxis
                        tickFormatter={(value) => {
                            return formatBps(value);
                        }}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </BarChart>
            </ResponsiveContainer>
            <div className={classes.toolbar}>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleBack(5)}
                    startIcon={<ArrowLeftIcon />}
                >
                    5 min
                </Button>

                <Button
                    className={classes.button}
                    variant="contained"
                    color={enableAutoRefresh ? "primary" : "secondary"}
                    onClick={handleLatest}
                    startIcon={<AccessTimeIcon />}
                >
                    Latest
                </Button>

                <TimePicker
                    ampm={false}
                    className={classes.timePicker}
                    value={range[1]}
                    onChange={handleTimePickerChange}
                />

                <Button
                    className={classes.button}
                    variant="contained"
                    disabled={enableAutoRefresh}
                    color="secondary"
                    onClick={() => handleForward(5)}
                    endIcon={<ArrowRightIcon />}
                >
                    5 min
                </Button>
            </div>
        </>
    );
}
