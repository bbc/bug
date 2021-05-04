import React from "react";
import FormControl from "@material-ui/core/FormControl";
import { Controller } from "react-hook-form";

import ChipInput from "material-ui-chip-input";

const ChipInputControl = ({ name, label, control, defaultValue, children, rules, error, chipsError, variant, ...props }) => {
    return (
        <FormControl {...props}>
            <Controller
                render={({field: { onChange, onBlur, value }}) =>
                    <ChipInput
                        variant={variant}
                        onBlur={onBlur}
                        onChange={onChange}
                        defaultValue={value}
                        label={label}
                        helperText={chipsError}
                        error={error}
                    />
                }
                name={name}
                control={control}
                defaultValue={defaultValue}
                rules={rules}
            />
        </FormControl>
    );
};
export default ChipInputControl;