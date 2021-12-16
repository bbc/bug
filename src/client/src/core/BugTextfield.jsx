import React from "react";
import TextField from "@mui/material/TextField";

const BugTextfield = (props) => {
    const handleChange = (event) => {
        let eventCopy = Object.assign({}, event);
        if (props.filter) {
            eventCopy.target.value = event.target.value.replace(props.filter, "");
            // eventCopy.target.value = stringToReplace.replace(/[^\w\s]/gi, '')
        }
        if (props.onChange !== undefined) {
            props.onChange(eventCopy);
        }
    };

    const handleBlur = (event) => {
        let eventCopy = Object.assign({}, event);
        let valueModified = false;
        if (props.min !== undefined && event.target.value < props.min) {
            eventCopy.target.value = props.min;
            valueModified = true;
        }
        if (props.max !== undefined && event.target.value > props.max) {
            eventCopy.target.value = props.max;
            valueModified = true;
        }
        if (valueModified && props.onChange !== undefined) {
            props.onChange(eventCopy);
        }
    };

    return (
        <TextField
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                "& .MuiInputBase-root": {
                    borderRadius: 0,
                },
                "& .MuiInputBase-input": {
                    padding: "14px",
                },
            }}
            fullWidth
            variant="outlined"
            {...props}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};

export default BugTextfield;
