import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugTextfield from "@core/BugTextfield";
import InputAdornment from "@mui/material/InputAdornment";

export default function CodecMux({ codecdata, onChange }) {
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
                                value={codecdata?.EncTsRate}
                                onChange={(event) => onChange(parseInt(event.target.value), "EncTsRate")}
                                filter={/[^0-9]/}
                                min={3200}
                                max={50000}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">kbps</InputAdornment>,
                                }}
                            ></BugTextfield>
                        ),
                    },
                ]}
            />
        </>
    );
}
