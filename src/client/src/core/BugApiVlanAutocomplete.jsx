import React from "react";
import BugApiAutocomplete from "@core/BugApiAutocomplete";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import convertToRange from "convert-to-ranges";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { useBugCustomDialog } from "@core/BugCustomDialog";
import BugVlansDialog from "./BugVlansDialog";

export default function BugApiVlanAutocomplete({
    options,
    taggedValue,
    untaggedValue,
    onChange,
    timeout = 8000,
    disabled = false,
}) {
    const [isActive, setIsActive] = React.useState(false);
    const [localTaggedValue, setLocalTaggedValue] = React.useState(taggedValue);
    const [localUntaggedValue, setLocalUntaggedValue] = React.useState(untaggedValue);
    const { customDialog } = useBugCustomDialog();
    const timer = React.useRef();

    React.useEffect(() => {
        if (
            isActive &&
            JSON.stringify(localTaggedValue) === JSON.stringify(taggedValue) &&
            localUntaggedValue === untaggedValue
        ) {
            // values are now the same - we can clear the active flag
            clearTimeout(timer.current);
            setIsActive(false);
        }
    }, [taggedValue, untaggedValue, isActive]);

    const handleChanged = (event, value) => {
        if (value.id === -1) {
            onChange(event, {
                untaggedVlan: 1,
                taggedVlans: ["1-4094"],
            });
        } else {
            onChange(event, {
                untaggedVlan: value.id,
                taggedVlans: [],
            });
        }
    };

    const handleEditClicked = async (event) => {
        event.stopPropagation();

        const result = await customDialog({
            dialog: <BugVlansDialog untaggedVlan={untaggedValue} taggedVlans={taggedValue} vlans={options} />,
        });
        if (result !== false && result.untaggedVlan && result.taggedVlans) {
            clearTimeout(timer.current);

            // fire the parent's event handler
            onChange(event, result);

            // set local values
            setLocalTaggedValue(result.taggedVlans);
            setLocalUntaggedValue(result.untaggedVlan);

            // disable the control and show the spinner (maybe?)
            setIsActive(true);

            // in timeout seconds, we will unset the active state as it probably didn't work
            timer.current = setTimeout(() => {
                setLocalTaggedValue(result.taggedVlans);
                setLocalUntaggedValue(result.untaggedVlan);
            }, timeout);
        }
    };

    let trunkLabel = "Trunk - Multiple VLANs";
    let value = null;
    const isTrunk = taggedValue.length > 0;
    const groupedOptions = options
        ? [
              {
                  id: -1,
                  label: trunkLabel,
              },
              ...options,
          ]
        : [];

    if (isTrunk) {
        value = -1;
        if (taggedValue?.length === options?.length) {
            trunkLabel = `Trunk - All VLANs`;
        } else {
            trunkLabel = `Trunk - ${convertToRange(taggedValue)}`;
        }
    } else {
        value = untaggedValue;
    }

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
                onChange={handleChanged}
                disabled={disabled || isActive}
                disableClearable={true}
                filterSelectedOptions={false}
                timeout={timeout}
                onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
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
                    onClick={handleEditClicked}
                >
                    <EditIcon />
                </IconButton>
            )}
        </Box>
    );
}
