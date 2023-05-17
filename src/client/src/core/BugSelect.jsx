import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const BugSelect = ({
    disabled = false,
    renderItem = false,
    fullWidth = true,
    variant = "outlined",
    options = [],
    onChange,
    value,
    sx = {},
    ...props
}) => {
    return (
        <TextField
            disabled={disabled}
            fullWidth={fullWidth}
            select
            value={value}
            variant={variant}
            onChange={onChange}
            {...props}
            sx={{
                "& .MuiInputBase-root": {
                    borderRadius: 0,
                },

                "& .MuiSelect-select": {
                    padding: "14px",
                },

                "& .MuiSelect-select:focus": {
                    backgroundColor: "inherit",
                },
                ...sx,
            }}
        >
            {options &&
                options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {renderItem ? renderItem(option) : option.label}
                    </MenuItem>
                ))}
        </TextField>
    );
};

export default BugSelect;
