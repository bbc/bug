import { Autocomplete, InputAdornment, TextField } from "@mui/material";

const formatBitrateLabel = (kbps) => {
    if (kbps >= 1024) {
        const mbps = kbps / 1024;
        return `${mbps % 1 === 0 ? mbps : mbps.toFixed(1)} Mbps`;
    }
    return `${kbps} kbps`;
};

const BugBitrateAutocomplete = ({
    disabled = false,
    fullWidth = true,
    value,
    options = [],
    onChange,
    min,
    max,
    sx = {},
}) => {
    const bitrateOptions = options.map((kbps) => ({
        label: formatBitrateLabel(kbps),
        kbps,
    }));

    const handleChange = (newValue) => {
        const parsed = parseInt(typeof newValue === "object" && newValue !== null ? newValue.kbps : newValue);
        if (isNaN(parsed) || parsed <= 0) {
            if (min !== undefined) onChange(min);
            return;
        }
        let clamped = parsed;
        if (min !== undefined && clamped < min) clamped = min;
        if (max !== undefined && clamped > max) clamped = max;
        onChange(clamped);
    };

    return (
        <Autocomplete
            freeSolo
            disableClearable
            disabled={disabled}
            fullWidth={fullWidth}
            value={String(value ?? "")}
            getOptionLabel={(option) => (typeof option === "string" ? option : String(option.kbps))}
            isOptionEqualToValue={(option, val) => String(option.kbps) === String(val)}
            renderOption={(props, option) => (
                <li {...props} key={option.kbps}>
                    {option.label}
                </li>
            )}
            onChange={(event, newValue) => handleChange(newValue)}
            options={bitrateOptions}
            sx={sx}
            renderInput={(params) => (
                <TextField
                    {...params}
                    onBlur={(event) => handleChange(event.target.value)}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                <InputAdornment position="end">kbps</InputAdornment>
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    sx={{
                        "& .MuiInputBase-root": {
                            borderRadius: 0,
                        },
                        "& .MuiInputBase-input": {
                            padding: "14px",
                        },
                    }}
                />
            )}
        />
    );
};

export default BugBitrateAutocomplete;
