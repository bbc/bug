import React from "react";
import BugPanelGroupDropdown from "@core/BugPanelGroupDropdown";
import { Controller } from "react-hook-form";

export default function BugConfigFormPanelGroup({ control, name, defaultValue, fullWidth = true }) {
    return (
        <Controller
            render={({ field: { ref, ...rest } }) => <BugPanelGroupDropdown {...rest} fullWidth={fullWidth} />}
            name={name}
            control={control}
            defaultValue={defaultValue}
        />
    );
}
