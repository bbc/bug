import React from "react";
import PanelGroupDropdown from "@core/PanelGroupDropdown";
import { Controller } from "react-hook-form";

export default function PanelGroupFormControl({ control, name, defaultValue }) {
    return (
        <Controller
            render={({ field: { ref, ...rest } }) => <PanelGroupDropdown {...rest} />}
            name={name}
            control={control}
            defaultValue={defaultValue}
        />
    );
}
