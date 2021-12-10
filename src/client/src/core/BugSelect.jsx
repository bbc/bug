import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const BugSelect = ({ items, ...props }) => {
    return (
        <TextField
            select
            value={props.value}
            fullWidth
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
