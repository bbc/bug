import BugColorPicker from "@core/BugColorPicker";
import BugDetailsTable from "@core/BugDetailsTable";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugTimeZonePicker from "@core/BugTimeZonePicker";
import { Box, Button, Grid, Input, Switch } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

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
            name: "Logo",
            value: (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "rows",
                    }}
                >
                    <label htmlFor="contained-button-file">
                        <Input
                            sx={{ display: "none" }}
                            id="contained-button-file"
                            multiple
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
                    <Box
                        sx={{
                            padding: "8px",
                            flexGrow: 1,
                        }}
                    >
                        {filename || "No file selected"}
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
