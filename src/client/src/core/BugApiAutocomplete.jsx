import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

//TODO - more work needed here to update the UI if the backend changes after a certain amount of time (like API Switch)

export default function BugApiAutocomplete({
    options,
    value,
    freeSolo = false,
    onChange,
    onClick,
    disableClearable = false,
    filterSelectedOptions = true,
    timeout = 5000,
    groupBy,
    renderOption,
    style,
    getOptionLabel,
}) {
    const [isActive, setIsActive] = React.useState(false);
    const [localValue, setLocalValue] = React.useState(value);
    const timer = React.useRef();

    React.useEffect(() => {
        // sometimes we end up with one of the values (new or old)
        // being an object. This is because the options array hasn't loaded,
        // so processValue() doesn't destructure it.

        const newValue = value?.id !== undefined ? value?.id : value;
        const oldValue = localValue?.id !== undefined ? localValue?.id : localValue;

        if (isActive && oldValue === newValue) {
            // value is now the same - we can clear the active flag
            clearTimeout(timer.current);
            setIsActive(false);
        }
    }, [value, isActive]);

    // we use this bit of code to work out if we're dealing with an array of objects.
    // autocomplete only allows simple arrays or object arrays with 'id' and 'label' keys
    let isObjectArray = false;
    if (Array.isArray(options) && options.length > 0 && options[0].id !== undefined && options[0].label !== undefined) {
        isObjectArray = true;
    }

    const handleChanged = (event, value) => {
        clearTimeout(timer.current);

        // call the parent onClick handler
        onChange(event, value);

        // update the local state
        setLocalValue(value);

        // disable the control and show the spinner (maybe?)
        setIsActive(true);

        // in timeout seconds, we will unset the active state as it probably didn't work
        timer.current = setTimeout(() => {
            setIsActive(false);
            setLocalValue(value);
        }, timeout);

        event.stopPropagation();
    };

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
            style={style}
            disabled={isActive}
            getOptionLabel={getOptionLabel}
            filterSelectedOptions={filterSelectedOptions}
            options={options ? options : []}
            freeSolo={freeSolo}
            disableClearable={disableClearable}
            groupBy={groupBy}
            renderOption={renderOption}
            onChange={handleChanged}
            onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onClick(event);
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
