import React from "react";
import TextField from "@mui/material/TextField";

const BugTextField = ({
    disabled = false,
    filter,
    fullWidth = true,
    helperText,
    max = null,
    maxLength,
    min = null,
    numeric = false,
    onChange,
    variant = "outlined",
    sx = {},
    value,
    changeOnBlur = false,
    type = "text",
    ...props
}) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
        // update local value if prop changes
        setLocalValue(value);
    }, [value]);

    const handleChange = (event) => {
        // pull out the value from the event
        let changedValue = event.target.value;

        if (numeric) {
            changedValue = changedValue.replace(/[^0-9]/, "");
            if (changedValue === "") {
                changedValue = min !== null ? min : 0;
            }
        }

        // update the local value
        setLocalValue(changedValue);

        // if we're set to call change on every keystroke, call the event handler
        if (typeof onChange === "function" && !changeOnBlur) {
            // pop it back into the eventCopy
            let eventCopy = Object.assign({}, event);
            eventCopy.target.value = changedValue;
            // call the event handler
            onChange(eventCopy);
        }
    };

    const handleBlur = (event) => {
        // pull out the value from the event
        let changedValue = event.target.value;

        let valueModified = false;
        if (numeric && min !== undefined && event.target.value < min) {
            changedValue = min.toString();
            valueModified = true;
        }
        if (numeric && max !== undefined && event.target.value > max) {
            changedValue = max.toString();
            valueModified = true;
        }
        if (filter) {
            if (typeof filter === "function") {
                changedValue = filter(changedValue);
            } else {
                changedValue = changedValue.replace(filter, "");
            }
            valueModified = true;
        }
        if (valueModified) {
            // update the local value
            setLocalValue(changedValue);
        }

        if (onChange !== undefined) {
            // we have an onChange event handler defined
            if (valueModified || changeOnBlur) {
                // it's been modified (by the filter) or we're set to call onChange on a blur

                // pop it back into the eventCopy
                let eventCopy = Object.assign({}, event);
                eventCopy.target.value = changedValue;

                // call the event handler
                onChange(eventCopy);
            }
        }
    };

    return (
        <TextField
            sx={
                variant === "outlined"
                    ? {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          "& .MuiInputBase-root": {
                              borderRadius: 0,
                          },
                          "& .MuiInputBase-input": {
                              padding: "14px",
                          },
                          ...sx,
                      }
                    : sx
            }
            fullWidth={fullWidth}
            variant={variant}
            disabled={disabled}
            helperText={helperText}
            value={localValue}
            {...props}
            // I don't think this works...:
            inputProps={{ maxLength: maxLength }}
            onChange={handleChange}
            onBlur={handleBlur}
            type={type}
        />
    );
};

export default BugTextField;
