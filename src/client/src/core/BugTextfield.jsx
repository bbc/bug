import React from "react";
import TextField from "@mui/material/TextField";

const BugTextField = (props) => {
    const onChange = (event) => {
        let eventCopy = Object.assign({}, event);
        if (props.filter) {
            console.log(props.filter);
            eventCopy.target.value = event.target.value.replace(props.filter, "");
            // eventCopy.target.value = stringToReplace.replace(/[^\w\s]/gi, '')
        }
        if (props.min !== undefined && event.target.value < props.min) {
            eventCopy.target.value = props.min;
        }
        if (props.max !== undefined && event.target.value > props.max) {
            eventCopy.target.value = props.max;
        }
        props.onChange(eventCopy);
    };

    return <TextField fullWidth variant="standard" {...props} onChange={onChange} />;
};

export default BugTextField;
