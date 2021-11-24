import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import BugHelperText from "@core/BugHelperText";
import { Controller } from "react-hook-form";

const BugConfigFormAutocomplete = ({
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
    // we use this bit of code to work out if we're dealing with an array of objects.
    // autocomplete only allows simple arrays or object arrays with 'id' and 'label' keys
    let isObjectArray = false;
    if (Array.isArray(options) && options.length > 0 && options[0].id !== undefined && options[0].label !== undefined) {
        isObjectArray = true;
    }

    const processValues = (value) => {
        if (!isObjectArray) {
            return value;
        }

        let returnArray = [];
        for (let eachValue of value) {
            const foundObject = options.find((object) => object.id === eachValue);
            if (foundObject) {
                returnArray.push(foundObject);
            }
        }
        return returnArray;
    };

    if (sort && !isObjectArray) {
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
                                options={options}
                                freeSolo={freeSolo}
                                onBlur={onBlur}
                                onChange={(event, values) => {
                                    if (isObjectArray) {
                                        const returnValues = [];
                                        for (let eachValue of values) {
                                            if (eachValue.id) {
                                                returnValues.push(eachValue.id);
                                            }
                                        }
                                        onChange(returnValues);
                                    } else {
                                        onChange(values);
                                    }
                                }}
                                defaultValue={processValues(value)}
                                value={processValues(value)}
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
            {helperText && <BugHelperText>{helperText}</BugHelperText>}
        </>
    );
};
export default BugConfigFormAutocomplete;
