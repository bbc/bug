import { Autocomplete, TextField } from "@mui/material";
import timezonesJSON from "timezones.json";

export default function BugTimeZonePicker({ helperText, label, onChange, value, variant = "outlined", sx = {} }) {
    const timezones = timezonesJSON.map((tz) => {
        return { label: tz.text, id: tz.value };
    });

    return (
        <Autocomplete
            sx={{
                "& .MuiInputBase-root": {
                    borderRadius: 0,
                },
                ...sx,
            }}
            onChange={onChange}
            autoHighlight={true}
            value={value?.label}
            options={timezones}
            renderInput={(params) => <TextField {...params} label={label} helperText={helperText} variant={variant} />}
        />
    );
}
