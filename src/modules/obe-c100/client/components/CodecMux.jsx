import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugTextField from "@core/BugTextField";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";

export default function CodecMux({ codecdata, onChange, showAdvanced }) {
    return (
        <>
            <BugDetailsCard
                title="Mux"
                width="10rem"
                items={[
                    {
                        name: "TS Bitrate",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={codecdata?.muxRate ? parseInt(codecdata?.muxRate) / 1000 : 0}
                                onChange={(event) => onChange({ muxRate: parseInt(event.target.value) * 1000 })}
                                filter={/[^0-9]/}
                                numeric
                                min={1000}
                                max={49000}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">kbps</InputAdornment>,
                                }}
                            ></BugTextField>
                        ),
                    },
                    showAdvanced && {
                        name: "Service Name",
                        value: (
                            <BugTextField
                                changeOnBlur
                                maxLength={64}
                                value={codecdata?.muxDvbServiceName}
                                onChange={(event) => onChange({ muxDvbServiceName: event.target.value })}
                            ></BugTextField>
                        ),
                    },
                    showAdvanced && {
                        name: "Provider Name",
                        value: (
                            <BugTextField
                                changeOnBlur
                                maxLength={64}
                                value={codecdata?.muxDvbProviderName}
                                onChange={(event) => onChange({ muxDvbProviderName: event.target.value })}
                            ></BugTextField>
                        ),
                    },
                    showAdvanced && {
                        name: "Enable Null Frames",
                        value: (
                            <Switch
                                checked={codecdata?.muxNullPackets}
                                onChange={(event) => onChange({ muxNullPackets: event.target.checked ? 1 : 0 })}
                            />
                        ),
                    },
                ]}
            />
        </>
    );
}
