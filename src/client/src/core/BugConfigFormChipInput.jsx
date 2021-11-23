// const BugConfigFormChipInput = ({
//     name,
//     label,
//     control,
//     sort,
//     defaultValue,
//     children,
//     rules,
//     error,
//     chipsError,
//     variant,
//     helperText,
//     ...props
// }) => {

import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";

const useStyles = makeStyles(async (theme) => ({
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

const BugConfigFormChipInput = ({
    name,
    label,
    control,
    sort,
    defaultValue,
    children,
    rules,
    error,
    options,
    variant,
    freeSolo,
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
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <Autocomplete
                                multiple
                                filterSelectedOptions
                                options={[]}
                                freeSolo={true}
                                onBlur={onBlur}
                                onChange={(event, values) => {
                                    onChange(values);
                                }}
                                defaultValue={value}
                                value={value || ""}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={label}
                                        helperText={helperText}
                                        error={error}
                                    />
                                )}
                            />
                        );
                    }}
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
export default BugConfigFormChipInput;
