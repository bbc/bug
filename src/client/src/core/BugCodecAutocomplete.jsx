import { Autocomplete, Box, Paper, TextField } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import React from "react";
export default function BugCodecAutocomplete({
    addressValue = "",
    apiUrl = "",
    capability = "",
    disabled = false,
    label = "Codec Name",
    mockApiData = null,
    onChange,
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
        const codec = options.find((item) => {
            return item.address === addressValue && parseInt(item.port) === parseInt(portValue);
        });

        if (codec) {
            // we have a match
            setValue(codec);
        } else {
            // clear the value
            setValue("");
        }
    }, [addressValue, portValue, options]);

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
                        backgroundColor: variant === "standard" ? "inherit" : "rgba(255, 255, 255, 0.05)",
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
