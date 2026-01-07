import { Autocomplete, TextField } from "@mui/material";

export default function BugAutocompletePlaceholder({ sx, value }) {
    return (
        <Autocomplete
            disabled={true}
            value={value}
            options={[value]}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
            sx={sx}
        />
    );
}
