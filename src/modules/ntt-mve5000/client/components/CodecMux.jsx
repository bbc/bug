import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugTextField from "@core/BugTextField";
import InputAdornment from "@mui/material/InputAdornment";

export default function CodecMux({ codecdata, onChange }) {
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
                                value={codecdata?.EncTsRate}
                                onChange={(event) => onChange({ EncTsRate: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
                                min={3200}
                                max={50000}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">kbps</InputAdornment>,
                                }}
                            ></BugTextField>
                        ),
                    },
                ]}
            />
        </>
    );
}
