import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useAlert } from "@utils/Snackbar";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import AxiosPut from "@utils/AxiosPut";
import BugDetailsTable from "@core/BugDetailsTable";
import { useSelector } from "react-redux";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugColorPicker from "@core/BugColorPicker";
import BugTimeZonePicker from "@core/BugTimeZonePicker";
import Input from "@mui/material/Input";
import Switch from "@mui/material/Switch";

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const sendAlert = useAlert(params?.panelId);
    const { renameDialog } = useBugRenameDialog();

    if (panelConfig.status === "idle" || panelConfig.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (panelConfig.status !== "success" || !panelConfig.data || !panelConfig.data) {
        return <BugNoData panelId={panelId} title="No device information found" showConfigButton={false} />;
    }

    const handleBackgroundColorChange = async (color) => {
        if (await AxiosPut(`/api/panelconfig/${params?.panelId}`, { backgroundColor: color.hex })) {
            sendAlert(`Successfully changed background color`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to change background color.`, { variant: "error" });
        }
    };

    const handleTextColorChange = async (color) => {
        if (await AxiosPut(`/api/panelconfig/${params?.panelId}`, { textColor: color.hex })) {
            sendAlert(`Successfully changed text color`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to change text color.`, { variant: "error" });
        }
    };

    const handleTimeZoneChange = async (event, timezone) => {
        if (await AxiosPut(`/api/panelconfig/${params?.panelId}`, { timezone: timezone })) {
            sendAlert(`Successfully changed timezone`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to change timezone.`, { variant: "error" });
        }
    };

    const handleShowDateChange = async (event) => {
        console.log(event.target.checked);
        if (await AxiosPut(`/api/panelconfig/${params?.panelId}`, { showDate: event.target.checked })) {
            sendAlert(`Now showing the date`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to show date.`, { variant: "error" });
        }
    };

    const handleShowTimeChange = async (event) => {
        console.log(event.target.checked);
        if (await AxiosPut(`/api/panelconfig/${params?.panelId}`, { showTime: event.target.checked })) {
            sendAlert(`Now showing the time`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to show time.`, { variant: "error" });
        }
    };

    const handleRenameClicked = async (event, currentHeader) => {
        const result = await renameDialog({
            title: "Main Title",
            defaultValue: currentHeader,
        });

        if (result === false) {
            return false;
        }

        if (await AxiosPut(`/api/panelconfig/${params?.panelId}`, { header: result })) {
            sendAlert(`Successfully renamed device`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to change clock title.`, { variant: "error" });
        }

        event.stopPropagation();
        event.preventDefault();
    };

    const handleLogoChange = async (event) => {
        const logo = event.target.files[0];
        const data = await toBase64(logo);
        if (
            await AxiosPut(`/api/panelconfig/${params?.panelId}`, {
                logo: { name: logo.name, image: data },
            })
        ) {
            sendAlert(`Successfully upadted logo`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to change logo.`, { variant: "error" });
        }
    };

    return (
        <>
            <Grid item xs={12}>
                <BugDetailsTable
                    items={[
                        {
                            name: "Name",
                            value: (
                                <BugTableLinkButton
                                    onClick={(event) => handleRenameClicked(event, panelConfig.data?.header)}
                                >
                                    {panelConfig.data?.header}
                                </BugTableLinkButton>
                            ),
                        },
                        {
                            name: "Background Color",
                            value: (
                                <BugColorPicker
                                    color={panelConfig?.data?.backgroundColor}
                                    onColorChange={handleBackgroundColorChange}
                                />
                            ),
                        },
                        {
                            name: "Text Color",
                            value: (
                                <BugColorPicker
                                    color={panelConfig?.data?.textColor}
                                    onColorChange={handleTextColorChange}
                                />
                            ),
                        },
                        {
                            name: "Time Zone",
                            value: (
                                <BugTimeZonePicker
                                    value={panelConfig?.data?.timezone}
                                    onChange={handleTimeZoneChange}
                                />
                            ),
                        },
                        {
                            name: "Show Date",
                            value: (
                                <Switch
                                    color="primary"
                                    onChange={handleShowDateChange}
                                    checked={panelConfig?.data?.showDate}
                                />
                            ),
                        },
                        {
                            name: "Show Time",
                            value: (
                                <Switch
                                    color="primary"
                                    onChange={handleShowTimeChange}
                                    checked={panelConfig?.data?.showTime}
                                />
                            ),
                        },
                        {
                            name: "Logo",
                            value: (
                                <Input
                                    color="primary"
                                    disableElevation
                                    underline="none"
                                    component="label"
                                    type="file"
                                    name="file"
                                    size="small"
                                    onChange={handleLogoChange}
                                    inputProps={{
                                        ...{ accept: "image/*" },
                                    }}
                                    fullWidth
                                ></Input>
                            ),
                        },
                    ]}
                />
            </Grid>
        </>
    );
}
