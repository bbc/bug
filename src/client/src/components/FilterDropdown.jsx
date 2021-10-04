import React from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const useStyles = makeStyles((theme) => ({
    textField: {
        "& .MuiInputBase-root": {
            borderRadius: 0,
            textTransform: "none",
        },
        "& .MuiInputBase-input": {
            paddingTop: 8,
            paddingBottom: 9.5,
            fontSize: "0.875rem",
        },
    },
}));

export default function FilterTextField({ value, onChange, options }) {
    const classes = useStyles();

    // const renderOptions = () => {
    //     return Object.keys(options).map((optionName) => (
    //         <MenuItem key={optionName} value={options[optionName]}>
    //             {optionName}
    //         </MenuItem>
    //     ));
    // };

    return (
        <TextField
            select
            className={classes.textField}
            onChange={onChange}
            size="small"
            variant="filled"
            fullWidth
            value={value}
            type="text"
            placeholder="Filter ..."
        >
            {options.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                    {option.name}
                </MenuItem>
            ))}
        </TextField>
    );
}
