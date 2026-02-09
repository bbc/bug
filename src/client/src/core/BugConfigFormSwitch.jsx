import BugHelperText from "@components/BugHelperText";
import { FormControl, FormControlLabel, Switch } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Controller } from "react-hook-form";

const BugConfigFormSwitch = ({ name, label, control, sort, defaultValue, rules, helperText, sx = {}, ...props }) => {
    const theme = useTheme();

    const borderColor = alpha(theme.palette.text.primary, 0.7);
    const hoverColor = theme.palette.text.primary;

    return (
        <>
            <FormControl
                {...props}
                sx={{
                    height: "40px",
                    borderBottom: `1px solid ${borderColor}`,
                    "&:hover": {
                        borderBottom: `2px solid ${hoverColor}`,
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
