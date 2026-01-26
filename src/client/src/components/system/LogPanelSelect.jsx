import { useApiPoller } from "@hooks/ApiPoller";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { Divider, MenuItem, Stack, TextField } from "@mui/material";

const LogPanelSelect = ({ panelId, mockApiData = null, sx = {}, onChange = {} }) => {
    const panels = useApiPoller({
        mockApiData: mockApiData,
        url: `/api/panel/`,
        interval: 10000,
    });

    const containers = useApiPoller({
        mockApiData: mockApiData,
        url: `/api/system/containers/`,
        interval: 20000,
    });

    if (panels.status === "loading" || containers.status === "loading") return null;

    if (panels.status !== "success" || containers.status !== "success") {
        return (
            <TextField disabled select value="" fullWidth variant="outlined">
                <MenuItem value="">No Panels Available</MenuItem>
            </TextField>
        );
    }

    let options = [
        {
            id: containers.data.find((container) => container.name === "bug").containerid,
            label: "BUG Application",
            active: false,
            isSystem: true,
        },
        {
            id: containers.data.find((container) => container.name === "bug-mongo").containerid,
            label: "BUG Database",
            active: false,
            isSystem: true,
        },
        { id: "", label: "--" },
    ];

    if (panels.status === "success") {
        options = options.concat(
            panels.data
                .filter((panel) => panel?._module?.needsContainer)
                .map((panel) => ({
                    id: panel.id,
                    label: panel.title,
                    active: panel?._active || false,
                }))
        );
    }

    return (
        <TextField
            select
            value={options.length > 0 ? panelId : ""}
            fullWidth
            variant="outlined"
            onChange={onChange}
            sx={{
                "& .MuiSelect-select:focus": {
                    backgroundColor: "inherit",
                },
                ...sx,
            }}
        >
            {options &&
                options.map((option) => {
                    return option.label === "--" ? (
                        <Divider key={option.id} />
                    ) : (
                        <MenuItem key={option.id} value={option.id} sx={{ display: "flex", alignItems: "center" }}>
                            <Stack direction="row" alignItems="center">
                                {!option.isSystem && (
                                    <PowerSettingsNewIcon
                                        sx={{
                                            fontSize: 20,
                                            mr: 1,
                                            color: option.active ? "primary.main" : "#ffffff",
                                            opacity: option.active ? 1 : 0.1,
                                        }}
                                    />
                                )}
                                {option.label}
                            </Stack>
                        </MenuItem>
                    );
                })}
        </TextField>
    );
};
export default LogPanelSelect;
