import React from "react";
import TextField from "@mui/material/TextField";

const BugTextField = ({
    min = null,
    max = null,
    filter,
    onChange,
    numeric = false,
    maxLength,
    variant = "outlined",
    ...props
}) => {
    const handleChange = (event) => {
        let eventCopy = Object.assign({}, event);
        if (numeric) {
            eventCopy.target.value = event.target.value.replace(/[^0-9]/, "");
            if (eventCopy.target.value === "") {
                eventCopy.target.value = min !== null ? min : 0;
            }
        }
        onChange(eventCopy);
    };

    const handleBlur = (event) => {
        let eventCopy = Object.assign({}, event);
        let valueModified = false;
        if (numeric && min !== undefined && event.target.value < min) {
            eventCopy.target.value = min;
            valueModified = true;
        }
        if (numeric && max !== undefined && event.target.value > max) {
            eventCopy.target.value = max;
            valueModified = true;
        }
        if (filter) {
            if (typeof filter === "function") {
                eventCopy.target.value = filter(event.target.value);
            } else {
                eventCopy.target.value = event.target.value.replace(filter, "");
            }
            valueModified = true;
        }
        if (valueModified && onChange !== undefined) {
            onChange(eventCopy);
        }
    };

    const sx =
        variant === "outlined"
            ? {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  "& .MuiInputBase-root": {
                      borderRadius: 0,
                  },
                  "& .MuiInputBase-input": {
                      padding: "14px",
                  },
              }
            : {};

    return (
        <TextField
            sx={sx}
            fullWidth
            variant={variant}
            {...props}
            inputProps={{ maxLength: maxLength }}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};

export default BugTextField;
