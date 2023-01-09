import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";

const BugConfigFormSelect = ({
    control,
    defaultValue,
    disabled = false,
    error,
    fullWidth = true,
    helperText,
    options = [],
    label,
    name,
    rules,
    sx = {},
    ...props
}) => {
    return (
        <>
            <FormControl fullWidth={fullWidth} {...props}>
                <Controller
                    render={({ field: { onChange, value } }) => {
                        return (
                            <TextField
                                select
                                value={value}
                                label={label}
                                disabled={disabled}
                                onChange={onChange}
                                variant="standard"
                                error={error}
                                helperText={helperText}
                                {...props}
                                sx={{
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: "inherit",
                                    },
                                    ...sx,
                                }}
                            >
                                {options &&
                                    options.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        );
                    }}
                    name={name}
                    control={control}
                    defaultValue={defaultValue}
                    rules={rules}
                />
            </FormControl>
        </>
    );
};
export default BugConfigFormSelect;
