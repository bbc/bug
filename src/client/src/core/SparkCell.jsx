import React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import Box from "@mui/material/Box";

export default function SparkCell({ value, history, height = 48 }) {
    if (!history || history.every((item) => item.value === 0)) {
        return null;
    }

    // pull values from array of objects
    let values = history.map((a) => a.value);

    const textTop = height / 2 - 10;

    return (
        <Box
            sx={{
                display: "flex",
            }}
        >
            {value && (
                <Box
                    sx={{
                        // position: "absolute",
                        zIndex: "1",
                        textShadow: "0px 0px 15px #000",
                        top: textTop,
                        marginLeft: "10px",
                    }}
                >
                    {value !== "0" ? value : ""}
                </Box>
            )}
            <Box
                sx={{
                    "& svg": {
                        width: "100%",
                    },
                    position: "absolute",
                    bottom: 4,
                    width: "100%",
                    paddingRight: "0.5rem",
                }}
            >
                <Sparklines height={height} data={values} style={{ opacity: 0.7 }} min={0}>
                    <SparklinesLine color="#337ab7" />
                </Sparklines>
            </Box>
        </Box>
    );
}
