import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugTextField from "@core/BugTextField";
import InputAdornment from "@mui/material/InputAdornment";

export default function CodecMux({ codecdata, onChange, showAdvanced }) {
    return (
        <>
            <BugDetailsCard
                title="Mux"
                width="10rem"
                data={[
                    {
                        name: "TS Bitrate",
                        value: (
                            <BugTextField
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
                                maxLength={64}
                                value={codecdata?.muxDvbProviderName}
                                onChange={(event) => onChange({ muxDvbProviderName: event.target.value })}
                            ></BugTextField>
                        ),
                    },
                ]}
            />
        </>
    );
}
