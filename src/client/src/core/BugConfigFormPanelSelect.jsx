import React from "react";
import { useApiPoller } from "@hooks/ApiPoller";
import BugConfigFormSelect from "@core/BugConfigFormSelect";

const BugConfigFormPanelSelect = ({
    name,
    label,
    control,
    defaultValue = "",
    disabled = false,
    fullWidth = true,
    rules,
    error,
    helperText,
    capability,
    mockApiData = null,
    sx = {},
}) => {
    const panels = useApiPoller({
        mockApiData: mockApiData,
        url: `/api/panel/bycapability/${capability}`,
        interval: 10000,
    });

    let options = [{ id: "", label: "" }];

    if (panels.status === "success") {
        options = options.concat(
            panels.data.map((panel) => ({
                id: panel.id,
                label: panel.title,
            }))
        );
    }

    return (
        <BugConfigFormSelect
            sx={sx}
            control={control}
            defaultValue={defaultValue}
            disabled={disabled}
            error={error}
            fullWidth={fullWidth}
            helperText={helperText}
            options={options}
            label={label}
            name={name}
            rules={rules}
        />
    );
};
export default BugConfigFormPanelSelect;
