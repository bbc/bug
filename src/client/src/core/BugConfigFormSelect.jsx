import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const BugConfigFormSelect = ({ items, disabled = false, ...props }) => {
    return (
        <TextField
            select
            value={props.value}
            fullWidth
            disabled={disabled}
            variant="standard"
            {...props}
            sx={{
                "& .MuiSelect-select:focus": {
                    backgroundColor: "inherit",
                },
            }}
        >
            {Object.keys(items).map((key, index) => (
                <MenuItem key={index} value={key}>
                    {items[key]}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default BugConfigFormSelect;
