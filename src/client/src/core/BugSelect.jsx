import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const BugSelect = ({
    disabled = false,
    renderItem = false,
    fullWidth = true,
    variant = "outlined",
    items,
    value,
    ...props
}) => {
    return (
        <TextField
            disabled={disabled}
            fullWidth={fullWidth}
            select
            value={value}
            variant={variant}
            {...props}
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                "& .MuiInputBase-root": {
                    borderRadius: 0,
                },

                "& .MuiSelect-select": {
                    padding: "14px",
                },

                "& .MuiSelect-select:focus": {
                    backgroundColor: "inherit",
                },
            }}
        >
            {items &&
                Object.keys(items).map((key, index) => (
                    <MenuItem key={index} value={key}>
                        {renderItem ? renderItem(items[key], key) : items[key]}
                    </MenuItem>
                ))}
        </TextField>
    );
};

export default BugSelect;
