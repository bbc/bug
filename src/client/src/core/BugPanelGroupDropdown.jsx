import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useSelector } from "react-redux";
import _ from "lodash";
import Paper from "@mui/material/Paper";

const filter = createFilterOptions();

export default function BugPanelGroupDropdown({ value, onChange, fullWidth = false, variant = "filled" }) {
    const panelList = useSelector((state) => state.panelList);
    const [inputValue, setInputValue] = React.useState(value);

    const CustomPaper = (props) => {
        return <Paper elevation={8} {...props} />;
    };

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
                event.stopPropagation();
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
                if (onChange) {
                    onChange(newInputValue ? newInputValue : "");
                }
                event.stopPropagation();
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                return filtered;
            }}
            selectOnFocus
            fullWidth={fullWidth}
            clearOnBlur
            PaperComponent={CustomPaper}
            variant="standard"
            handleHomeEndKeys
            options={panelListGroups}
            freeSolo
            renderInput={(params) => <TextField variant="standard" {...params} label="Panel group" />}
        />
    );
}