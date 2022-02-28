import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function FilterDropdown({ value, onChange, options, multiple = false }) {
    return (
        <TextField
            select
            sx={{
                "& .MuiInputBase-root": {
                    borderRadius: 0,
                    textTransform: "none",
                },

                "& .MuiSelect-select": {
                    padding: "14px",
                },

                "& .MuiSelect-select:focus": {
                    backgroundColor: "inherit",
                },

                "& .MuiInputBase-input": {
                    paddingTop: "9px",
                    paddingBottom: "10px",
                    fontSize: "0.875rem",
                },
            }}
            onChange={onChange}
            size="small"
            variant="standard"
            fullWidth
            value={value}
            type="text"
            placeholder="Filter ..."
            multiple={multiple}
        >
            {options.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
}
