import BugTextField from "@core/BugTextField";
import { FormControl } from "@mui/material";
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
    validationResult,
    variant = "standard",
    InputProps = {},
    sx = {},
    ...props
}) => {
    const validationStatus = validationResult?.status || "idle";
    const validationMessage = validationResult?.message;
    const resolvedHelperText =
        validationStatus === "pending"
            ? validationMessage || "Checking..."
            : validationStatus !== "idle"
              ? validationMessage
              : helperText;
    const helperColor =
        resolvedHelperText === "Checking..." || validationStatus === "pending"
            ? "text.secondary"
            : validationStatus === "success" || validationStatus === "valid"
              ? "success.main"
              : "text.primary";

    return (
        <>
            <FormControl
                fullWidth={fullWidth}
                sx={{
                    "& .MuiFormHelperText-root:not(.Mui-error)": {
                        color: helperColor,
                    },
                }}
            >
                <Controller
                    render={({ field: { onChange, value } }) => {
                        return (
                            <BugTextField
                                changeOnBlur={false}
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
                                error={error || validationStatus === "error"}
                                min={min}
                                max={max}
                                helperText={resolvedHelperText}
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
