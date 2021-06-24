import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { useSelector } from "react-redux";
import _ from "lodash";
import Paper from "@material-ui/core/Paper";

const filter = createFilterOptions();

export default function PanelGroupDropdown({ value, onChange, fullWidth = false, variant = "filled" }) {
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
            variant={variant}
            handleHomeEndKeys
            options={panelListGroups}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Search or enter a new group" />}
        />
    );
}
