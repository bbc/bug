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
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import BugHelperText from "@core/BugHelperText";

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
    if (sort && defaultValue) {
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
                                options={options ? options : []}
                                freeSolo={true}
                                onBlur={onBlur}
                                onChange={(event, values) => {
                                    onChange(values);
                                }}
                                defaultValue={value}
                                value={value || ""}
                                renderInput={(params) => (
                                    <TextField {...params} variant="standard" label={label} error={error} />
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
            {helperText && <BugHelperText>{helperText}</BugHelperText>}
        </>
    );
};
export default BugConfigFormChipInput;
