import { Autocomplete, FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

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
    sx = {},
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
                                sx={sx}
                                multiple
                                filterSelectedOptions
                                options={options ? options : []}
                                freeSolo={true}
                                onBlur={onBlur}
                                blurOnSelect="touch"
                                onChange={(event, values) => {
                                    onChange(values);
                                }}
                                defaultValue={value}
                                value={value || ""}
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
export default BugConfigFormChipInput;
