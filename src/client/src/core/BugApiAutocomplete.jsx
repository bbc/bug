import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function BugApiAutocomplete({ options, value, freeSolo = false, onChange }) {
    // we use this bit of code to work out if we're dealing with an array of objects.
    // autocomplete only allows simple arrays or object arrays with 'id' and 'label' keys
    let isObjectArray = false;
    if (Array.isArray(options) && options.length > 0 && options[0].id !== undefined && options[0].label !== undefined) {
        isObjectArray = true;
    }

    const processValue = (value) => {
        if (!isObjectArray) {
            // just use the value
            return value;
        }

        // find the id/label pair in the options array and return it
        return options?.find((object) => object.id === value);
    };

    return (
        <Autocomplete
            filterSelectedOptions
            options={options ? options : []}
            freeSolo={freeSolo}
            onChange={(event, value) => {
                onChange(event, value);
                event.stopPropagation();
                event.preventDefault();
            }}
            onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}
            value={processValue(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                    }}
                />
            )}
        />
    );
}