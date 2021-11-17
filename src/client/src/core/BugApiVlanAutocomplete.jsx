import React from "react";
import BugApiAutocomplete from "@core/BugApiAutocomplete";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import convertToRange from "convert-to-ranges";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export default function BugApiVlanAutocomplete({ options, taggedValue, untaggedValue, onChange }) {
    let value = null;
    let trunkLabel = "Trunk (multiple)";
    const isTrunk = taggedValue.length > 0;

    if (isTrunk) {
        value = -1;
        trunkLabel = `Trunk ${convertToRange(taggedValue)}`;
    } else {
        value = untaggedValue;
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
        <Box
            sx={{
                display: "flex",
                width: "100%",
            }}
        >
            <BugApiAutocomplete
                style={{ flexGrow: 1 }}
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
            {isTrunk && (
                <IconButton
                    sx={{
                        width: 54,
                        height: 54,
                    }}
                    aria-label="Edit Trunks"
                >
                    <EditIcon />
                </IconButton>
            )}
        </Box>
    );
}
