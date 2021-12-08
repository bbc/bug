import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const BugSelect = ({ items, ...props }) => {
    return (
        <TextField
            select
            fullWidth
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

export default BugSelect;
