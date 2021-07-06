import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { Controller } from "react-hook-form";

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
    acData,
    acTextKey,
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
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <Autocomplete
                                multiple
                                filterSelectedOptions
                                options={acData}
                                getOptionLabel={(option) => option[acTextKey]}
                                onBlur={onBlur}
                                onChange={(event, values) => {
                                    onChange(values);
                                }}
                                defaultValue={value}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant={variant}
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
export default ConfigFormChipInput;
