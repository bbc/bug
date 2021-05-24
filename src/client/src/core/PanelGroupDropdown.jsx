import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { useSelector } from "react-redux";
import _ from "lodash";

const filter = createFilterOptions();

export default function PanelGroupDropdown({ value, onChange, fullWidth = false, variant = "filled" }) {
    const panelList = useSelector((state) => state.panelList);
    const [inputValue, setInputValue] = React.useState(value);

    if (panelList.status !== "success") {
        return null;
    }
    let panelListGroups = _.uniq(panelList.data.map((a) => a.group));
    _.pull(panelListGroups, "");

    return (
        <Autocomplete
            value={value}
            defaultValue={value}
            onChange={(event, newValue) => {
                if (onChange) {
                    onChange(newValue ? newValue : "");
                }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
                if (onChange) {
                    onChange(newInputValue ? newInputValue : "");
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                return filtered;
            }}
            selectOnFocus
            fullWidth={fullWidth}
            clearOnBlur
            variant={variant}
            handleHomeEndKeys
            options={panelListGroups}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Search or enter a new group" variant="filled" />}
        />
    );
}
