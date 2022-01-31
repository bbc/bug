import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import Box from "@mui/material/Box";
import useDimensions from "react-cool-dimensions";

export default function BugGauge({ max = 100, value, title = "", unit = "", decimalPlaces = 2 }) {
    const { observe, width, height } = useDimensions({
        onResize: ({ observe, unobserve }) => {
            unobserve();
            observe();
        },
    });

    const limitedValue = Math.min(value, max);

    const label = !isNaN(limitedValue) ? `${parseFloat(limitedValue).toFixed(decimalPlaces)}${unit}` : "";
    return (
        <div ref={observe}>
            <Box
                sx={{
                    position: "relative",
                    height: `${width * 0.6}px`,
                    width: width,
                    "& path": {
                        stroke: "#212121",
                    },
                    backgroundColor: "#262626",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        margin: "auto",
                        textAlign: "left",
                        width: width,
                        // fontSize: `${Math.round(width / 25)}px`,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        paddingTop: `${Math.round(width * 0.025)}px`,
                        paddingLeft: `${Math.round(width * 0.05)}px`,
                        color: "#fff",
                    }}
                >
                    {title}
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        margin: "auto",
                        textAlign: "center",
                        width: width,
                        bottom: "0px",
                        padding: `${Math.round(width / 24)}px`,
                        fontSize: `${Math.round(width / 12)}px`,
                        opacity: 0.5,
                        fontWeight: 500,
                    }}
                >
                    {label}
                </Box>
                <Box
                    sx={{
                        overflow: "hidden",
                        width: "100%",
                        paddingTop: "20px",
                        paddingLeft: `${width * 0.05}px`,
                        paddingRight: `${width * 0.05}px`,
                        height: `${height - 10}px`,
                    }}
                >
                    <PieChart width={width * 0.9} height={height * 1.6}>
                        <Pie
                            isAnimationActive={false}
                            data={[
                                { name: "Group A", value: limitedValue },
                                { name: "Group B", value: max - limitedValue },
                            ]}
                            startAngle={180}
                            endAngle={0}
                            innerRadius="80%"
                            outerRadius="100%"
                            paddingAngle={0}
                            dataKey="value"
                        >
                            <Cell fill="#337ab7" />
                            <Cell fill="#181818" />
                        </Pie>
                    </PieChart>
                </Box>
            </Box>
        </div>
    );
}
