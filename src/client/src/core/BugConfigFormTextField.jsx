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
    type = "text",
    rules,
    error,
    filter = "",
    helperText,
    supportsValidation = false,
    variant = "standard",
    InputProps = {},
    numeric = false,
    min = null,
    max = null,
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
