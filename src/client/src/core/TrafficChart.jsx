import React from "react";
import formatBps from "@core/format-bps";
import "../../node_modules/react-vis/dist/style.css";
import { format } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";

import {
    FlexibleWidthXYPlot,
    XAxis,
    YAxis,
    VerticalBarSeries,
    DiscreteColorLegend,
} from "react-vis";

// const useStyles = makeStyles((theme) => ({
//     xAxis: {

//     },
//     yAxis: {
//     }
// }));


export default function TrafficChart({ data }) {
    // const classes = useStyles();

    if (!data) {
        return null;
    }
    return (
        <>
            <FlexibleWidthXYPlot margin={{ left: 80 }} height={350}>
                <XAxis
                    style={{
                        ticks: {stroke: '#fff'},
                        line: { 
                            stroke: '#eee', 
                            strokeWidth: 1
                        }
                    }}
                    title="Time"
                    tickTotal={4}
                    tickFormat={(value, index, scale, tickTotal) => {
                        return format(value, "kk:mm");
                    }}
                />
                <YAxis
                    style={{
                        ticks: {stroke: '#ff0000'},
                        line: { 
                            stroke: '#ffff00', 
                            strokeWidth: '1px'
                        }
                    }}
                    title="Bitrate"
                    tickTotal={3}
                    tickFormat={(value, index, scale, tickTotal) => {
                        return formatBps(value);
                    }}
                />
                <VerticalBarSeries data={data["tx"]} color="#0000ff" barWidth={0.8} />
                <VerticalBarSeries data={data["rx"]} color="#ff0000" barWidth={0.8} />
            </FlexibleWidthXYPlot>
            <DiscreteColorLegend height={200} width={300} items={["TX", "RX"]} />;
        </>
    );
}
