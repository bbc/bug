import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextfield from "@core/BugTextfield";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";

export default function CodecOutput({ outputData, onChange, onClose, outputIndex, showAdvanced }) {
    const handleChange = (value, field) => {
        // there are a few cases which need to be handled differently
        if (field === "outputMethod" && value === 1) {
            // for UDP, we can't have FEC
            onChange(1, "outputFecType");
            // for UDP, we can't have a duplicate stream
            onChange(0, "outputDupDelay");
        }
        if (field === "outputMethod" && value === 3) {
            // for RIST, we can't have FEC
            onChange(1, "outputFecType");
            // for RIST, we can't have a duplicate stream
            onChange(0, "outputDupDelay");
        }

        onChange(value, field);
    };

    return (
        <>
            <BugDetailsCard
                closable
                onClose={() => onClose(outputIndex)}
                title={`Output ${outputIndex + 1}`}
                width="11rem"
                data={[
                    {
                        name: "Output Type",
                        value: (
                            <BugSelect
                                value={outputData?.outputMethod}
                                onChange={(event) => handleChange(parseInt(event.target.value), "outputMethod")}
                                items={{
                                    1: "UDP",
                                    2: "RTP",
                                    3: "RIST/ARQ",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "IP Address",
                        value: (
                            <BugTextfield
                                value={outputData?.outputIP}
                                onChange={(event) => handleChange(event.target.value, "outputIP")}
                                // filter={/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/}
                            />
                        ),
                    },
                    {
                        name: "Port",
                        value: (
                            <BugTextfield
                                value={outputData?.outputPort}
                                onChange={(event) => handleChange(parseInt(event.target.value), "outputPort")}
                                filter={/[^0-9]/}
                                min={1024}
                                max={65531}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "TTL",
                        value: (
                            <BugTextfield
                                value={outputData?.outputTTL}
                                onChange={(event) => handleChange(parseInt(event.target.value), "outputTTL")}
                                filter={/[^0-9]/}
                                min={1}
                                max={255}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "TOS",
                        value: (
                            <BugSelect
                                value={outputData?.outputTOS}
                                onChange={(event) => handleChange(parseInt(event.target.value), "outputTOS")}
                                items={{
                                    0: "None",
                                    104: "DSCP 26",
                                }}
                            ></BugSelect>
                        ),
                    },
                    outputData?.outputMethod === 2 && {
                        name: "Error Correction",
                        value: (
                            <BugSelect
                                value={outputData?.outputFecType}
                                onChange={(event) => handleChange(parseInt(event.target.value), "outputFecType")}
                                items={{
                                    1: "None",
                                    2: "FEC",
                                }}
                            ></BugSelect>
                        ),
                    },
                    outputData?.outputFecType === 2 && {
                        name: "FEC Columns",
                        value: (
                            <BugTextfield
                                value={outputData?.outputFecColumns}
                                onChange={(event) => handleChange(parseInt(event.target.value), "outputFecColumns")}
                                filter={/[^0-9]/}
                                min={1}
                                max={20}
                            />
                        ),
                    },
                    outputData?.outputFecType === 2 && {
                        name: "FEC Rows",
                        value: (
                            <BugTextfield
                                value={outputData?.outputFecRows}
                                onChange={(event) => handleChange(parseInt(event.target.value), "outputFecRows")}
                                filter={/[^0-9]/}
                                min={4}
                                max={20}
                            />
                        ),
                    },
                    outputData?.outputMethod === 2 &&
                        showAdvanced && {
                            name: "Duplicate Stream",
                            value: (
                                <Switch
                                    checked={outputData?.outputDupDelay > 0}
                                    onChange={(event) => handleChange(event.target.checked ? 1 : 0, "outputDupDelay")}
                                />
                            ),
                        },
                    outputData?.outputMethod === 2 &&
                        showAdvanced && {
                            name: "Duplicate Stream Delay",
                            value: (
                                <BugTextfield
                                    disabled={outputData?.outputDupDelay === 0}
                                    value={outputData?.outputDupDelay}
                                    onChange={(event) => handleChange(parseInt(event.target.value), "outputDupDelay")}
                                    filter={/[^0-9]/}
                                    min={1}
                                    max={1000}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">ms</InputAdornment>,
                                    }}
                                />
                            ),
                        },
                    outputData?.outputMethod === 3 && {
                        name: "RIST/ARQ Buffer",
                        value: (
                            <BugTextfield
                                value={outputData?.outputARQBuffer}
                                onChange={(event) => handleChange(parseInt(event.target.value), "outputARQBuffer")}
                                filter={/[^0-9]/}
                                min={1}
                                max={1000}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">ms</InputAdornment>,
                                }}
                            />
                        ),
                    },
                ]}
            />
        </>
    );
}
