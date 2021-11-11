import React from "react";
import BugApiAutocomplete from "@core/BugApiAutocomplete";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import convertToRange from "convert-to-ranges";

export default function BugApiVlanAutocomplete({ options, taggedValue, untaggedValue, onChange }) {
    let value = null;
    let trunkLabel = "Trunk (multiple)";
    if (taggedValue.length > 0) {
        // trunk port
        value = -1;
        trunkLabel = `Trunk ${convertToRange(taggedValue)}`;
    } else if (untaggedValue.length === 1) {
        // access port
        value = untaggedValue[0];
    }
    const groupedOptions = options
        ? [
              {
                  id: -1,
                  label: "Trunk (multiple)",
              },
              ...options,
          ]
        : [];

    return (
        <BugApiAutocomplete
            options={groupedOptions}
            value={value}
            freeSolo={false}
            onChange={onChange}
            // disableClearable={true}
            filterSelectedOptions={false}
            getOptionLabel={(option) => {
                if (!option || !option.id) {
                    return "";
                }
                return option.id === -1 ? trunkLabel : `${option.id} - ${option.label}`;
            }}
            renderOption={(props, option) => {
                if (option.id === -1) {
                    return [
                        <li {...props} key={option.id}>
                            {option.label}
                        </li>,
                        <Divider key="divider" />,
                    ];
                } else {
                    return (
                        <li {...props} key={option.id}>
                            <Box
                                sx={{
                                    opacity: 0.5,
                                    marginRight: "1rem",
                                }}
                            >
                                {option.id}
                            </Box>
                            {option.label}
                        </li>
                    );
                }
            }}
        />
    );
}
