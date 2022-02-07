import React from "react";
import BugTextField from "@core/BugTextField";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";

const BugConfigFormFileUpload = ({
    name,
    label,
    control,
    disabled = false,
    fullWidth = false,
    error,
    helperText,
    ...props
}) => {
    return (
        <>
            <FormControl fullWidth={fullWidth}>
                <Controller
                    render={({ field: { onChange, value } }) => {
                        return (
                            <BugTextField
                                label={label}
                                fullWidth
                                disabled={disabled}
                                component="label"
                                type="file"
                                size="small"
                                underline="none"
                                inputProps={{
                                    ...{ accept: "application/gzip" },
                                }}
                            />
                        );
                    }}
                    name={name}
                    control={control}
                    rules={{ required: true }}
                />
            </FormControl>
        </>
    );
};

export default BugConfigFormFileUpload;
