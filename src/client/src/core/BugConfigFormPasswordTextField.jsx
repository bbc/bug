import BugPasswordTextField from "@core/BugPasswordTextField";
import { FormControl } from "@mui/material";
import { Controller } from "react-hook-form";

const BugConfigFormPasswordTextField = ({
    name,
    label,
    control,
    disabled = false,
    defaultValue,
    rules,
    error,
    helperText,
    supportsValidation = false,
    validationResult,
    variant = "standard",
    allowShowPassword = true,
    type = "text",
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
                {...props}
                sx={{
                    "& .MuiFormHelperText-root:not(.Mui-error)": {
                        color: helperColor,
                    },
                }}
            >
                <Controller
                    render={({ field: { onChange, value } }) => {
                        return (
                            <BugPasswordTextField
                                sx={sx}
                                value={value}
                                label={label}
                                fullWidth
                                disabled={disabled}
                                onChange={onChange}
                                variant={variant}
                                error={error || validationStatus === "error"}
                                helperText={resolvedHelperText}
                                allowShowPassword={allowShowPassword}
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

export default BugConfigFormPasswordTextField;
