import { Paper, TextField } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";

const filter = createFilterOptions();

const CustomPaper = (props) => {
    return <Paper elevation={8} {...props} />;
};

export default function BugPanelGroupDropdown({ value, onChange, fullWidth = false, variant = "standard", sx = {} }) {
    const panelList = useSelector((state) => state.panelList);
    const [inputValue, setInputValue] = React.useState(value);

    let panelListGroups = panelList.data ? _.uniq(panelList.data.map((a) => a.group.toUpperCase())) : [];
    _.pull(panelListGroups, "");

    return (
        <Autocomplete
            sx={{ ...sx }}
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
                    onChange(newInputValue ? newInputValue.toLowerCase() : "");
                }

                if (event) {
                    event.stopPropagation();
                }
            }}
            filterOptions={(options, params) => {
                return filter(options, params);
            }}
            selectOnFocus
            fullWidth={fullWidth}
            clearOnBlur
            PaperComponent={CustomPaper}
            handleHomeEndKeys
            options={panelListGroups}
            freeSolo
            renderInput={(params) => (
                <TextField
                    variant={variant}
                    {...params}
                    label="Panel group"
                    sx={{
                        "& .MuiInputBase-input": {
                            textTransform: "uppercase",
                        },
                    }}
                />
            )}
        />
    );
}
