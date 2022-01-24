import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
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
                                <BugTextField
                                    onChange={(event) => onChange({ inputBarsLine1: event.target.value })}
                                    value={codecdata?.inputBarsLine1}
                                />
                            ),
                        },
                        {
                            name: "Bars Line 2",
                            value: (
                                <BugTextField
                                    onChange={(event) => onChange({ inputBarsLine2: event.target.value })}
                                    value={codecdata?.inputBarsLine2}
                                />
                            ),
                        },
                        {
                            name: "Bars Line 3",
                            value: (
                                <BugTextField
                                    onChange={(event) => onChange({ inputBarsLine3: event.target.value })}
                                    value={codecdata?.inputBarsLine3}
                                />
                            ),
                        },
                        {
                            name: "Bars Line 4",
                            value: (
                                <BugTextField
                                    onChange={(event) => onChange({ inputBarsLine4: event.target.value })}
                                    value={codecdata?.inputBarsLine4}
                                />
                            ),
                        },
                        showAdvanced && {
                            name: "Clapper",
                            value: (
                                <Switch
                                    checked={codecdata?.inputClapper === 1}
                                    onChange={(event) => onChange({ inputClapper: event.target.checked ? 1 : 0 })}
                                />
                            ),
                        },
                        showAdvanced && {
                            name: "Clapper Interval",
                            value: (
                                <BugTextField
                                    value={codecdata?.inputClapperInterval}
                                    onChange={(event) =>
                                        onChange({ inputClapperInterval: parseInt(event.target.value) })
                                    }
                                    filter={/[^0-9]/}
                                    numeric
                                    min={1}
                                    max={20}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">sec</InputAdornment>,
                                    }}
                                ></BugTextField>
                            ),
                        },
                    ]}
                />
            )}
        </>
    );
}
