import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import timezonesJSON from "timezones.json";

export default function BugTimeZonePicker({ helperText, label, onChange, value, variant = "outlined", sx = {} }) {
    return (
        <Autocomplete
            sx={sx}
            onChange={onChange}
            autoHighlight={true}
            value={value?.label}
            options={timezones}
            renderInput={(params) => <TextField {...params} label={label} helperText={helperText} variant={variant} />}
        />
    );
}

const timezones = JSON.parse(timezonesJSON);
