import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const BugSelect = ({ items, disabled = false, ...props }) => {
    return (
        <TextField
            select
            value={props.value}
            fullWidth
            disabled={disabled}
            variant="outlined"
            {...props}
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                "& .MuiInputBase-root": {
                    borderRadius: 0,
                },

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

export default BugSelect;
