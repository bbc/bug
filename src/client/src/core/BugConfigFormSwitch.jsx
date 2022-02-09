import React from "react";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import BugHelperText from "@components/BugHelperText";

const BugConfigFormSwitch = ({ name, label, control, sort, defaultValue, rules, helperText, ...props }) => {
    return (
        <>
            <FormControl
                {...props}
                sx={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                        borderBottom: "1px solid #fff",
                    },
                }}
            >
                <Controller
                    render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                            sx={{
                                "& .MuiTypography-root": {
                                    color: "rgba(255, 255, 255, 1)",
                                    fontSize: "0.875rem",
                                    fontWeight: "400",
                                },
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
