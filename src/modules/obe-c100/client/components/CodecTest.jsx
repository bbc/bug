import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextfield from "@core/BugTextfield";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";

export default function CodecVideo({ codecdata, onChange, showAdvanced }) {
    return (
        <>
            {codecdata?.inputDeviceType === 2 && (
                <BugDetailsCard
                    title="Test"
                    width="10rem"
                    data={[
                        {
                            name: "Bars Line 1",
                            value: (
                                <BugTextfield
                                    onChange={(event) => onChange(event.target.value, "inputBarsLine1")}
                                    value={codecdata?.inputBarsLine1}
                                />
                            ),
                        },
                        {
                            name: "Bars Line 2",
                            value: (
                                <BugTextfield
                                    onChange={(event) => onChange(event.target.value, "inputBarsLine2")}
                                    value={codecdata?.inputBarsLine2}
                                />
                            ),
                        },
                        {
                            name: "Bars Line 3",
                            value: (
                                <BugTextfield
                                    onChange={(event) => onChange(event.target.value, "inputBarsLine3")}
                                    value={codecdata?.inputBarsLine3}
                                />
                            ),
                        },
                        {
                            name: "Bars Line 4",
                            value: (
                                <BugTextfield
                                    onChange={(event) => onChange(event.target.value, "inputBarsLine4")}
                                    value={codecdata?.inputBarsLine4}
                                />
                            ),
                        },
                        showAdvanced && {
                            name: "Clapper",
                            value: (
                                <Switch
                                    checked={codecdata?.inputClapper === 1}
                                    onChange={(event) => onChange(event.target.checked ? 1 : 0, "inputClapper")}
                                />
                            ),
                        },
                        showAdvanced && {
                            name: "Clapper Interval",
                            value: (
                                <BugTextfield
                                    value={codecdata?.inputClapperInterval}
                                    onChange={(event) => onChange(parseInt(event.target.value), "inputClapperInterval")}
                                    filter={/[^0-9]/}
                                    min={1}
                                    max={20}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">sec</InputAdornment>,
                                    }}
                                ></BugTextfield>
                            ),
                        },
                    ]}
                />
            )}
        </>
    );
}
