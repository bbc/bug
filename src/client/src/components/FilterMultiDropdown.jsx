import { Checkbox, ListItemText, MenuItem, Select } from "@mui/material";

export default function FilterMultiDropdown({ value = [], onChange, options }) {
    return (
        <Select
            sx={{
                "& .MuiSelect-select": {
                    borderRadius: 0,
                    textTransform: "none",
                    paddingTop: "9px",
                    paddingBottom: "10px",
                    backgroundColor: "inherit !important",
                },
            }}
            multiple
            fullWidth
            value={value ? value : []}
            onChange={onChange}
            variant="standard"
            renderValue={(selected) => selected.join(", ")}
        >
            {options.map((option, index) => (
                <MenuItem key={index} value={option.id} sx={{ paddingLeft: "0px" }}>
                    <Checkbox checked={value.includes(option.id)} />
                    <ListItemText primary={option.label} />
                </MenuItem>
            ))}
        </Select>
    );
}
