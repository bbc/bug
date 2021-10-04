import React from "react";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import ChipInput from "@components/ChipInput";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
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

const ConfigFormChipInput = ({
    name,
    label,
    control,
    sort,
    defaultValue,
    children,
    rules,
    error,
    chipsError,
    variant,
    helperText,
    ...props
}) => {
    const classes = useStyles();

    if (sort) {
        // sort the contents (case insensitive)
        defaultValue = defaultValue.slice().sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
    }

    return (
        <>
            <FormControl {...props}>
                <Controller
                    render={({ field: { onChange, onBlur, value } }) => (
                        <ChipInput
                            variant={variant}
                            onBlur={onBlur}
                            onChange={onChange}
                            defaultValue={value}
                            label={label}
                            helperText={chipsError}
                            error={error}
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
export default ConfigFormChipInput;
