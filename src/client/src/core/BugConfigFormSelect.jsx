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
    fullWidth=true,
    helperText,
    items = [],
    label,
    name,
    rules,
    ...props
}) => {
    return (
        <>
            <FormControl {...props}>
                <Controller
                    render={({ field: { onChange, value } }) => {
                        return (
                            <TextField
                                select
                                value={value}
                                label={label}
                                fullWidth={fullWidth}
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
                                }}
                            >
                                {items &&
                                    Object.keys(items).map((key, index) => (
                                        <MenuItem key={index} value={key}>
                                            {items[key]}
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
