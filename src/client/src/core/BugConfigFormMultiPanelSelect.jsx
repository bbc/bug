import { useApiPoller } from "@hooks/ApiPoller";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const BugConfigFormMultiPanelSelect = ({
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
    sx = {},
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
                                sx={sx}
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
export default BugConfigFormMultiPanelSelect;
