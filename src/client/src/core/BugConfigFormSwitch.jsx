import React from "react";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import BugHelperText from "@components/BugHelperText";
import { useTheme } from "@mui/material/styles";

const BugConfigFormSwitch = ({ name, label, control, sort, defaultValue, rules, helperText, sx = {}, ...props }) => {
    const theme = useTheme();

    return (
        <>
            <FormControl
                {...props}
                sx={{
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                    "&:hover": {
                        borderBottom: `2px solid ${theme.palette.secondary.main}`,
                    },
                }}
            >
                <Controller
                    render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                            sx={{
                                "& .MuiTypography-root": {
                                    color: "text.primary",
                                    fontSize: "0.875rem",
                                    fontWeight: "400",
                                },
                                ...sx,
                            }}
                            control={<Switch color="primary" onChange={onChange} checked={value} />}
                            label={label}
                        />
                    )}
                    name={name}
                    control={control}
                    defaultValue={defaultValue}
                    rules={rules}
                />
            </FormControl>
            {helperText && <BugHelperText>{helperText}</BugHelperText>}
        </>
    );
};
export default BugConfigFormSwitch;
