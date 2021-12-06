import React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import Box from "@mui/material/Box";

export default function SparkCell({ value, history, height = null }) {
    if (!history || history.every((item) => item.value === 0)) {
        return null;
    }

    // pull values from array of objects
    let values = history.map((a) => a.value);

    // replace all undefined values with 0
    values = values.map((v) => (v === undefined ? 0 : v));

    return (
        <Box
            sx={{
                display: "flex",
            }}
        >
            {value && (
                <Box
                    sx={{
                        position: "absolute",
                        zIndex: "1",
                        textShadow: "0px 0px 15px #000",
                        margin: "0",
                        marginLeft: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
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
                    width: "100%",
                }}
            >
                <Sparklines data={values} style={{ opacity: 0.7, height: height ? height : "100%" }} min={0}>
                    <SparklinesLine color="#337ab7" />
                </Sparklines>
            </Box>
        </Box>
    );
}
