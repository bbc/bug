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
    variant = "standard",
    allowShowPassword = true,
    type = "text",
    sx = {},
    ...props
}) => {
    return (
        <>
            <FormControl
                {...props}
                sx={{
                    "& .MuiFormHelperText-root:not(.Mui-error)": {
                        color: supportsValidation ? "success.main" : "text.primary",
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
                                error={error}
                                helperText={helperText}
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
