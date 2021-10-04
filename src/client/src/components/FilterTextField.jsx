import React from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";

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
