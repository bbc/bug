import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import { usePanelStatus } from "@hooks/PanelStatus";

export default function Toolbar(props) {
    const toolbarProps = { ...props };
    const location = useLocation();
    const panelStatus = usePanelStatus();

    if (!panelStatus) {
        return null;
    }

    const editMode = location.pathname.indexOf("/edit") > -1;

    const buttons = () => (
        <>
            {editMode ? (
                <Button
                    component={Link}
                    to={`/panel/${props.panelId}`}
                    variant="outlined"
                    color="primary"
                    startIcon={<DoneIcon />}
                >
                    Done
                </Button>
            ) : (
                <Button
                    component={Link}
                    to={`/panel/${props.panelId}/edit`}
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                >
                    Edit
                </Button>
            )}
        </>
    );

    const menuItems = () => null;

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} isClosed={false} />;
}
