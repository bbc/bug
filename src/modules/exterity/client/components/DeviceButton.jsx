import React, { useState } from "react";
import { useSelector } from "react-redux";
import DeviceDialog from "./DeviceDialog";
import AxiosPut from "@utils/AxiosPut";
import AxiosPost from "@utils/AxiosPost";
import Button from "@mui/material/Button";
import TvIcon from "@mui/icons-material/Tv";

import { useAlert } from "@utils/Snackbar";

export default function DeviceButton({ panelId, open, deviceId }) {
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const [dialogOpen, setDialogOpen] = useState(open);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);

    const createDevice = async (device) => {
        const response = await AxiosPost(`/container/${panelId}/devices`, device);
        if (response) {
            sendAlert(`Created device ${device.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not create device ${device.title}`, { variant: "error" });
        }
        setCurrentDeviceId(null);
    };

    const updateDevice = async (device, deviceId) => {
        setCurrentDeviceId(null);
        const response = await AxiosPut(`/container/${panelId}/devices/${deviceId}`, device);
        if (response) {
            sendAlert(`Updated device ${device.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not update device ${device.title}`, { variant: "error" });
        }
    };

    const onDismiss = () => {
        setDialogOpen(false);
        setCurrentDeviceId(null);
    };

    return (
        <>
            <Button
                onClick={() => {
                    setDialogOpen(true);
                }}
                variant="outlined"
                color="primary"
                startIcon={<TvIcon />}
            >
                Add Device
            </Button>
            <DeviceDialog
                deviceId={deviceId}
                defaultData={panelConfig?.data?.devices[currentDeviceId]}
                open={dialogOpen}
                onDismiss={onDismiss}
                onCreate={createDevice}
                onEdit={updateDevice}
            />
        </>
    );
}
