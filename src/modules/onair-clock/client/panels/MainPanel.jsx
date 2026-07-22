import BugColorPicker from "@core/BugColorPicker";
import BugDetailsTable from "@core/BugDetailsTable";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugTimeZonePicker from "@core/BugTimeZonePicker";
import { Box, Button, Grid, Input, MenuItem, Switch, TextField } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moduleDefinition from "../../module.json";

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export default function MainPanel() {
    const params = useParams();
    const panelId = params?.panelId;
    const panelConfig = useSelector((state) => state.panelConfig);
    const panelData = panelConfig.data;
    const defaultLogo = moduleDefinition.defaultconfig.logo;
    const [filename, setFilename] = useState(panelData?.logo?.name);

    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    useEffect(() => {
        setFilename(panelData?.logo?.name);
    }, [panelData?.logo?.name]);

    if (panelConfig.status === "idle" || panelConfig.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (panelConfig.status !== "success" || !panelData) {
        return <BugNoData panelId={panelId} title="No device information found" showConfigButton={false} />;
    }

    const updatePanelConfig = async (payload, successMessage, errorMessage) => {
        const updated = await AxiosPut(`/api/panelconfig/${panelId}`, payload);

        if (updated) {
            sendAlert(successMessage, { broadcast: "true", variant: "success" });
            return true;
        }

        sendAlert(errorMessage, { variant: "error" });
        return false;
    };

    const handleBackgroundColorChange = async (color) => {
        await updatePanelConfig(
            { backgroundColor: color.hex },
            "Successfully changed background color",
            "Failed to change background color."
        );
    };

    const handleTextColorChange = async (color) => {
        await updatePanelConfig(
            { textColor: color.hex },
            "Successfully changed text color",
            "Failed to change text color."
        );
    };

    const handleTimeZoneChange = async (event, timezone) => {
        await updatePanelConfig({ timezone }, "Successfully changed timezone", "Failed to change timezone.");
    };

    const handleShowDateChange = async (event) => {
        await updatePanelConfig({ showDate: event.target.checked }, "Now showing the date", "Failed to show date.");
    };

    const handleShowTimeChange = async (event) => {
        await updatePanelConfig({ showTime: event.target.checked }, "Now showing the time", "Failed to show time.");
    };

    const handleShowLogoChange = async (event) => {
        await updatePanelConfig(
            { showLogo: event.target.checked },
            "Updated logo visibility",
            "Failed to update logo visibility."
        );
    };

    const handleFontWeightChange = async (event) => {
        const nextFontWeight = event.target.value;

        await updatePanelConfig(
            { fontWeight: nextFontWeight },
            "Updated text weight",
            "Failed to update text weight."
        );
    };

    const handleRenameClicked = async (event, currentHeader) => {
        const result = await renameDialog({
            title: "Main Title",
            defaultValue: currentHeader,
        });

        if (result === false) {
            return false;
        }

        await updatePanelConfig({ header: result }, "Successfully renamed device", "Failed to change clock title.");

        event.stopPropagation();
        event.preventDefault();
    };

    const handleLogoChange = async (event) => {
        const logo = event.target.files[0];

        if (!logo) {
            return;
        }

        const data = await toBase64(logo);

        await updatePanelConfig(
            { logo: { name: logo.name, image: data } },
            "Successfully updated logo",
            "Failed to change logo."
        );
    };

    const handleResetLogo = async () => {
        if (await updatePanelConfig({ logo: defaultLogo }, "Successfully reset logo", "Failed to reset logo.")) {
            setFilename(defaultLogo?.name || "");
        }
    };

    const detailsItems = [
        {
            name: "Name",
            value: (
                <BugTableLinkButton onClick={(event) => handleRenameClicked(event, panelData.header)}>
                    {panelData.header}
                </BugTableLinkButton>
            ),
        },
        {
            name: "Background Color",
            value: <BugColorPicker color={panelData.backgroundColor} onColorChange={handleBackgroundColorChange} />,
        },
        {
            name: "Text Color",
            value: <BugColorPicker color={panelData.textColor} onColorChange={handleTextColorChange} />,
        },
        {
            name: "Time Zone",
            value: <BugTimeZonePicker value={panelData.timezone} onChange={handleTimeZoneChange} />,
        },
        {
            name: "Show Date",
            value: <Switch color="primary" onChange={handleShowDateChange} checked={panelData.showDate} />,
        },
        {
            name: "Show Time",
            value: <Switch color="primary" onChange={handleShowTimeChange} checked={panelData.showTime} />,
        },
        {
            name: "Show Logo",
            value: <Switch color="primary" onChange={handleShowLogoChange} checked={panelData.showLogo !== false} />,
        },
        {
            name: "Text Weight",
            value: (
                <TextField
                    select
                    size="small"
                    value={panelData.fontWeight || "400"}
                    onChange={handleFontWeightChange}
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="300">Light</MenuItem>
                    <MenuItem value="400">Normal</MenuItem>
                    <MenuItem value="500">Medium</MenuItem>
                    <MenuItem value="700">Bold</MenuItem>
                </TextField>
            ),
        },
        {
            name: "Logo",
            value: (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <TextField
                        variant="outlined"
                        sx={{
                            flexGrow: 1,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 0,
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: 0,
                            },
                        }}
                        value={filename || "No file selected"}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <Box>
                        <label htmlFor="contained-button-file">
                            <Input
                                sx={{ display: "none" }}
                                id="contained-button-file"
                                onChange={(event) => {
                                    const nextFilename = event.target.value.replace(/^.*\\/, "");
                                    setFilename(nextFilename);
                                    handleLogoChange(event);
                                }}
                                type="file"
                                inputProps={{
                                    ...{ accept: "image/*" },
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    width: "6rem",
                                    height: "36px",
                                }}
                                component="span"
                            >
                                Select
                            </Button>
                        </label>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ ml: 1, minWidth: "auto" }}
                            onClick={handleResetLogo}
                        >
                            Reset
                        </Button>
                    </Box>
                </Box>
            ),
        },
    ];

    return (
        <>
            <Grid size={{ xs: 12 }}>
                <BugDetailsTable items={detailsItems} />
            </Grid>
        </>
    );
}
