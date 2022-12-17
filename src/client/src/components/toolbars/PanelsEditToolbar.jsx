import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { usePanelToolbarEventTrigger } from "@hooks/PanelToolbarEvent";

export default function PanelsToolbar() {
    const triggerPanelEvent = usePanelToolbarEventTrigger();

    const handleAddClicked = async (event, item) => {
        triggerPanelEvent("addGroup");
    };

    const handleSaveClicked = async (event, item) => {
        triggerPanelEvent("save");
    };

    return (
        <>
            <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={handleAddClicked}>
                Add Group
            </Button>
            <Button variant="outlined" color="primary" startIcon={<DoneIcon />} onClick={handleSaveClicked}>
                Save
            </Button>
            <Button
                component={Link}
                to={`/panels`}
                variant="outlined"
                color="primary"
                startIcon={<CancelIcon />}
                style={{ marginRight: 16 }}
            >
                Cancel
            </Button>
        </>
    );
}
