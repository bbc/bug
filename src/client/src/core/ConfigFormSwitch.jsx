import React from "react";
import FormControl from "@material-ui/core/FormControl";
import { Controller } from "react-hook-form";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    control: {
        borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
        "&:hover": {
            borderBottom: "2px solid #fff",
        },
    },
    label: {
        "& .MuiTypography-root": {
            color: "rgba(255, 255, 255, 0.7)",
            opacity: "0.7",
            fontSize: "0.875rem",
            fontWeight: "400",
        },
    },
    helperText: {
        color: "rgba(255, 255, 255, 0.7)",
        margin: "0",
        fontSize: "0.75rem",
        marginTop: "3px",
        textAlign: "left",
        fontFamily: "ReithSans",
        fontWeight: "400",
        lineHeight: "1.66",
    },
}));

const ConfigFormSwitch = ({ name, label, control, sort, defaultValue, children, rules, helperText, ...props }) => {
    const classes = useStyles();

    return (
        <>
            <FormControl {...props} className={classes.control}>
                <Controller
                    render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                            className={classes.label}
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
            {helperText && <div className={classes.helperText}>{helperText}</div>}
        </>
    );
};
export default ConfigFormSwitch;
