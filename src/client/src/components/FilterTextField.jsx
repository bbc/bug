import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
    textField: {
        "& .MuiInputBase-root": {
            borderRadius: 0,
        },
        "& .MuiInputBase-input": {
            paddingTop: 10,
            paddingBottom: 10,
            fontSize: "0.875rem",
        },
    },
}));

export default function FilterTextField({ value, onChange }) {
    const classes = useStyles();

    return (
        <TextField
            className={classes.textField}
            onChange={onChange}
            size="small"
            variant="filled"
            fullWidth
            value={value}
            type="text"
            placeholder="Filter ..."
        />
    );
}
