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
}) => {
    const panels = useApiPoller({
        mockApiData: mockApiData,
        url: `/api/panel/bycapability/${capability}`,
        interval: 10000,
    });

    // NEW STYLE
    // const options =
    //     panels.status === "success"
    //         ? panels.data.map((panel) => ({
    //               id: panel.id,
    //               label: panel.title,
    //           }))
    //         : [];

    let options = {};
    if (panels.status === "success") {
        for (let panel of panels.data) {
            options[panel.id] = panel.title;
        }
    }

    return (
        <BugConfigFormSelect
            control={control}
            defaultValue={defaultValue}
            disabled={disabled}
            error={error}
            fullWidth={fullWidth}
            helperText={helperText}
            items={options}
            label={label}
            name={name}
            rules={rules}
        />
    );
};
export default BugConfigFormPanelSelect;
