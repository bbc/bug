import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";
import BugCodecAutocomplete from "@core/BugCodecAutocomplete";

export default function CodecOutput({
    outputData,
    onChange,
    onClose,
    outputIndex,
    showAdvanced,
    panelId,
    showCodecDropdown,
}) {
    const handleChange = (values) => {
        // there are a few cases which need to be handled differently
        if (values["outputMethod"] === 1) {
            // for UDP, we can't have FEC
            values["outputFecType"] = 1;
            // for UDP, we can't have a duplicate stream
            values["outputDupDelay"] = 0;
        }
        if (values["outputMethod"] === 3) {
            // for RIST, we can't have FEC
            values["outputFecType"] = 1;
            // for RIST, we can't have a duplicate stream
            values["outputDupDelay"] = 0;
        }

        onChange(values);
    };

    let codecCapability = "udp";
    if (outputData?.outputMethod === 2) {
        codecCapability = "rtp";
    } else if (outputData?.outputMethod === 3) {
        codecCapability = "rist";
    }

    return (
        <>
            <BugDetailsCard
                closable
                onClose={() => onClose(outputIndex)}
                title={`Output ${outputIndex + 1}`}
                width="11rem"
                items={[
                    {
                        name: "Output Type",
                        value: (
                            <BugSelect
                                value={outputData?.outputMethod}
                                onChange={(event) => handleChange({ outputMethod: parseInt(event.target.value) })}
                                options={[
                                    { id: 1, label: "UDP" },
                                    { id: 2, label: "RTP" },
                                    { id: 3, label: "RIST/ARQ" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showCodecDropdown && {
                        name: "Codec",
                        value: (
                            <BugCodecAutocomplete
                                addressValue={outputData?.outputIP}
                                portValue={outputData?.outputPort}
                                apiUrl={`/container/${panelId}/codecdb`}
                                capability={codecCapability}
                                onChange={(event, codec) => {
                                    onChange({
                                        outputIP: codec.address,
                                        outputPort: codec.port,
                                    });
                                }}
                            />
                        ),
                    },
                    {
                        name: "IP Address",
                        value: (
                            <BugTextField
                                value={outputData?.outputIP}
                                onChange={(event) => handleChange({ outputIP: event.target.value })}
                                // filter={/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/}
                            />
                        ),
                    },
                    {
                        name: "Port",
                        value: (
                            <BugTextField
                                value={outputData?.outputPort}
                                onChange={(event) => handleChange({ outputPort: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
                                min={1024}
                                max={65531}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "TTL",
                        value: (
                            <BugTextField
                                value={outputData?.outputTTL}
                                onChange={(event) => handleChange({ outputTTL: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
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
                                onChange={(event) => handleChange({ outputTOS: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "None" },
                                    { id: 104, label: "DSCP 26 (TOS 104)" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    outputData?.outputMethod === 2 && {
                        name: "Error Correction",
                        value: (
                            <BugSelect
                                value={outputData?.outputFecType}
                                onChange={(event) => handleChange({ outputFecType: parseInt(event.target.value) })}
                                options={[
                                    { id: 1, label: "None" },
                                    { id: 2, label: "FEC" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    outputData?.outputFecType === 2 && {
                        name: "FEC Columns",
                        value: (
                            <BugTextField
                                value={outputData?.outputFecColumns}
                                onChange={(event) => handleChange({ outputFecColumns: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
                                min={1}
                                max={20}
                            />
                        ),
                    },
                    outputData?.outputFecType === 2 && {
                        name: "FEC Rows",
                        value: (
                            <BugTextField
                                value={outputData?.outputFecRows}
                                onChange={(event) => handleChange({ outputFecRows: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
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
                                    onChange={(event) => handleChange({ outputDupDelay: event.target.checked ? 1 : 0 })}
                                />
                            ),
                        },
                    // outputData?.outputMethod === 2 &&
                    showAdvanced && {
                        name: "Duplicate Stream Delay",
                        value: (
                            <BugTextField
                                disabled={outputData?.outputDupDelay === 0}
                                value={outputData?.outputDupDelay}
                                onChange={(event) => handleChange({ outputDupDelay: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
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
                            <BugTextField
                                value={outputData?.outputARQBuffer}
                                onChange={(event) => handleChange({ outputARQBuffer: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
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
