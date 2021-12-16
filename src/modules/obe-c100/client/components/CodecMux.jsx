import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugTextfield from "@core/BugTextfield";
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
                            <BugTextfield
                                value={codecdata?.muxRate ? parseInt(codecdata?.muxRate) / 1000 : 0}
                                onChange={(event) => onChange(parseInt(event.target.value) * 1000, "muxRate")}
                                filter={/[^0-9]/}
                                min={1000}
                                max={49000}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">kbps</InputAdornment>,
                                }}
                            ></BugTextfield>
                        ),
                    },
                    showAdvanced && {
                        name: "Service Name",
                        value: (
                            <BugTextfield
                                value={codecdata?.muxDvbServiceName}
                                onChange={(event) => onChange(event.target.value, "muxDvbServiceName")}
                            ></BugTextfield>
                        ),
                    },
                    showAdvanced && {
                        name: "Provider Name",
                        value: (
                            <BugTextfield
                                value={codecdata?.muxDvbProviderName}
                                onChange={(event) => onChange(event.target.value, "muxDvbProviderName")}
                            ></BugTextfield>
                        ),
                    },
                ]}
            />
        </>
    );
}
