import { Autocomplete, Box, Paper, TextField } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import React from "react";
export default function BugCodecAutocomplete({
    addressValue = "",
    apiUrl = "",
    calculateValue,
    capability = "",
    disabled = false,
    label = "Select Codec",
    mockApiData = null,
    onChange,
    onValueResolved,
    portValue = "",
    variant = "outlined",

    sx = {},
}) {
    const [options, setOptions] = React.useState([]);
    const [value, setValue] = React.useState("");

    React.useEffect(() => {
        if (mockApiData) {
            setOptions(mockApiData);
        } else {
            const fetchOptions = async () => {
                const result = await AxiosGet(`${apiUrl}/${capability}`);
                if (result) {
                    setOptions(
                        result.map((item) => ({
                            id: item.id,
                            label: item.name,
                            device: item.device,
                            address: item.address,
                            port: item.port,
                            params: item.params,
                        }))
                    );
                }
            };

            fetchOptions();
        }
    }, [apiUrl, capability, mockApiData]);

    React.useEffect(() => {
        // address and/or port has changed
        // we need to search the codec list for any matching values
        const codec =
            typeof calculateValue === "function"
                ? calculateValue({ options, addressValue, portValue })
                : options.find((item) => {
                      return item.address === addressValue && parseInt(item.port) === parseInt(portValue);
                  });

        const resolvedCodec =
            codec && typeof codec === "object" && codec.id
                ? options.find((item) => item.id === codec.id) || codec
                : options.find((item) => item.id === codec) || codec;

        if (resolvedCodec) {
            // we have a match
            setValue(resolvedCodec);
        } else {
            // clear the value
            setValue("");
        }

        if (typeof onValueResolved === "function") {
            onValueResolved(resolvedCodec || null);
        }
    }, [addressValue, calculateValue, onValueResolved, options, portValue]);

    const handleChanged = (event, value) => {
        // find the selected codec
        const selectedCodec = options.find((item) => item.id === value.id);
        if (selectedCodec) {
            setValue(selectedCodec);
            onChange(event, selectedCodec);
        }
        event.stopPropagation();
    };

    return (
        <Autocomplete
            sx={sx}
            disabled={disabled}
            value={value}
            options={options ? options : []}
            disableClearable={true}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.id} style={{ display: "flex", justifyContent: "space-between" }}>
                        <Box
                            sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {option.label}
                        </Box>
                        <Box
                            sx={{
                                paddingLeft: "8px",
                                opacity: 0.5,
                                fontSize: "0.8rem",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {option.device}
                        </Box>
                    </li>
                );
            }}
            onChange={handleChanged}
            onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}
            PaperComponent={({ children, ...other }) => (
                <Paper square elevation={8}>
                    {children}
                </Paper>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={label}
                    variant={variant}
                    sx={{
                        "& .MuiInputBase-root": {
                            borderRadius: 0,
                        },
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                    }}
                />
            )}
        />
    );
}
