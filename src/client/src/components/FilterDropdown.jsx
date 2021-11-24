import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function FilterTextField({ value, onChange, options }) {
    return (
        <TextField
            select
            sx={{
                "& .MuiInputBase-root": {
                    borderRadius: 0,
                    textTransform: "none",
                },
                "& .MuiInputBase-input": {
                    paddingTop: 8,
                    paddingBottom: 9.5,
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
        >
            {options.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                    {option.name}
                </MenuItem>
            ))}
        </TextField>
    );
}
