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
    error,
    filter = "",
    fullWidth = false,
    helperText,
    max = null,
    min = null,
    numeric = false,
    rules,
    type = "text",
    supportsValidation = false,
    variant = "standard",
    InputProps = {},
    sx = {},
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
                                sx={sx}
                                value={value}
                                label={label}
                                fullWidth
                                filter={filter}
                                disabled={disabled}
                                onChange={(event) => {
                                    onChange(event);
                                    if (props.onChange) {
                                        props.onChange(event);
                                    }
                                }}
                                numeric={numeric}
                                variant={variant}
                                error={error}
                                min={min}
                                max={max}
                                helperText={helperText}
                                InputProps={InputProps}
                                type={type}
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
