import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function BugAutocompletePlaceholder({ value }) {
    return (
        <Autocomplete
            disabled={true}
            value={value}
            options={[{ value }]}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
    );
}
