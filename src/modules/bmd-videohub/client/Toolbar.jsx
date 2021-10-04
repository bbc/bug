import React from "react";
import ToolbarWrapper from "@core/ToolbarWrapper";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import { usePanelStatus } from "@core/PanelStatusHook";

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
    return <ToolbarWrapper {...toolbarProps} isClosed={false} />;
}
