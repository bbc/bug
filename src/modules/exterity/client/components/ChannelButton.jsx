import React, { useState } from "react";
import { useSelector } from "react-redux";
import ChannelDialog from "./ChannelDialog";
import AxiosPut from "@utils/AxiosPut";
import AxiosPost from "@utils/AxiosPost";
import Button from "@mui/material/Button";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

import { useAlert } from "@utils/Snackbar";

export default function ChannelButton({ open = false, panelId, channelId }) {
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const [dialogOpen, setDialogOpen] = useState(open);
    const [currentChannelId, setCurrentChannelId] = useState(null);

    const createChannel = async (channel) => {
        const response = await AxiosPost(`/container/${panelId}/channels`, channel);
        if (response) {
            sendAlert(`Created channel ${channel.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not create channel ${channel.title}`, { variant: "error" });
        }
        setCurrentChannelId(null);
    };

    const updateChannel = async (channel, channelId) => {
        setCurrentChannelId(null);
        const response = await AxiosPut(`/container/${panelId}/channels/${channelId}`, channel);
        if (response) {
            sendAlert(`Updated channel ${channel.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not update channel ${channel.title}`, { variant: "error" });
        }
    };

    const onDismiss = () => {
        setDialogOpen(false);
        setCurrentChannelId(null);
    };

    return (
        <>
            <Button
                onClick={() => {
                    setDialogOpen(true);
                }}
                variant="outlined"
                color="primary"
                startIcon={<FormatListNumberedIcon />}
            >
                Add Channel
            </Button>
            <ChannelDialog
                channelId={channelId}
                defaultData={panelConfig?.data?.channels[currentChannelId]}
                open={dialogOpen}
                panelId={panelId}
                onDismiss={onDismiss}
                onCreate={createChannel}
                onEdit={updateChannel}
            />
        </>
    );
}
