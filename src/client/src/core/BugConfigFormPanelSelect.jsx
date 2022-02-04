import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import { useApiPoller } from "@hooks/ApiPoller";

const BugConfigFormPanelSelect = ({
    name,
    label,
    control,
    defaultValue,
    children,
    rules,
    error,
    helperText,
    capability,
    mockApiData = null,
    ...props
}) => {
    const panels = useApiPoller({
        mockApiData: mockApiData,
        url: `/api/panel/bycapability/${capability}`,
        interval: 10000,
    });

    const options =
        panels.status === "success"
            ? panels.data.map((panel) => ({
                  id: panel.id,
                  label: panel.title,
              }))
            : [];

    const processValues = (value) => {
        let returnArray = [];
        if (value) {
            for (let eachValue of value) {
                const foundObject = options.find((object) => object.id === eachValue);
                if (foundObject) {
                    returnArray.push(foundObject);
                }
            }
        }
        return returnArray;
    };

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
                                onBlur={onBlur}
                                onChange={(event, values) => {
                                    const returnValues = [];
                                    for (let eachValue of values) {
                                        if (eachValue.id) {
                                            returnValues.push(eachValue.id);
                                        }
                                    }
                                    onChange(returnValues);
                                }}
                                defaultValue={processValues(value)}
                                value={processValues(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        helperText={helperText}
                                        variant="standard"
                                        label={label}
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
        </>
    );
};
export default BugConfigFormPanelSelect;
