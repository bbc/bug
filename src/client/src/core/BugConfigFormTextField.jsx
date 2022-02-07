import React from "react";
import BugTextField from "@core/BugTextField";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";

const BugConfigFormTextField = ({
    name,
    label,
    control,
    disabled = false,
    defaultValue,
    fullWidth = false,
    rules,
    error,
    helperText,
    supportsValidation = false,
    variant = "standard",
    numeric = false,
    min,
    max,
    ...props
}) => {
    return (
        <>
            <FormControl
                fullWidth={fullWidth}
                sx={{
                    "& .MuiFormHelperText-root:not(.Mui-error)": {
                        color: supportsValidation ? "success.main" : "text.primary",
                    },
                }}
            >
                <Controller
                    render={({ field: { onChange, value } }) => {
                        return (
                            <BugTextField
                                value={value}
                                label={label}
                                fullWidth
                                disabled={disabled}
                                onChange={onChange}
                                variant={variant}
                                error={error}
                                helperText={helperText}
                                numeric={numeric}
                                min={min}
                                max={max}
                            />
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

export default BugConfigFormTextField;
