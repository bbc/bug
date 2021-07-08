import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
    ComposedChart,
    Line,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useWindowSize } from "@utils/WindowSize";
import moment from "moment";

export default function DecoderStatistics({ decoder, panelId }) {
    const windowSize = useWindowSize();
    const theme = useTheme();
    const chartHeight = windowSize.height < 650 ? windowSize.height - 200 : 450;

    if (decoder?.decoderStats) {
        const graphData = decoder?.decoderStats.map((item) => {
            if (item?.decoder_video_decode_errors === 0) {
                delete item.decoder_video_decode_errors;
            }

            if (item?.decoder_video_decode_errors === 0) {
                delete item.decoder_video_decode_errors;
            }
            return item;
        });

        return (
            <ResponsiveContainer width="100%" height={chartHeight}>
                <ComposedChart
                    data={graphData}
                    margin={{
                        top: 30,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        domain={[graphData[0]?.timestamp, graphData[graphData?.length - 1]?.timestamp]}
                        dataKey="timestamp"
                        tickFormatter={(unixTime) => moment(Math.round(unixTime / 1000)).format("HH:mm Do")}
                        type="number"
                    />
                    <YAxis label="Framerate (FPS)" />
                    <Tooltip />
                    <Legend />
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        label="Framerate"
                        dataKey="decoder_vdec_framerate"
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                    <Scatter dataKey="decoder_video_decode_errors" fill={theme.palette.error.main} />
                    <Scatter dataKey="decoder_video_decode_errors" fill={theme.palette.error.main} />
                </ComposedChart>
            </ResponsiveContainer>
        );
    }
    return null;
}
