import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import AxiosPost from "@utils/AxiosPost";
import { usePanelStatus } from "@hooks/PanelStatus";

export default function Toolbar({ panelId, ...props }) {
    let toolbarProps = { ...props };
    const panelStatus = usePanelStatus();

    const handleAdd = async () => {
        console.log("Add Note");
        const response = await AxiosPost(`/container/${panelId}/notes`);
    };

    const buttons = () => (
        <>
            <Button onClick={handleAdd} variant="outlined" color="primary" startIcon={<AddIcon />}>
                New Note
            </Button>
        </>
    );

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
