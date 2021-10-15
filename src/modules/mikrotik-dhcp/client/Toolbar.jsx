import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import Button from "@mui/material/Button";
import { usePanelStatus } from "@hooks/PanelStatus";
import { useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export default function Toolbar(props) {
    const toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    const location = useLocation();

    if (!panelStatus) {
        return null;
    }

    const buttons = () => {
        if (location.pathname.indexOf("lease") > -1) {
            return null;
        }

        if (panelStatus.hasCritical) {
            return null;
        }

        return (
            <>
                <Button
                    component={Link}
                    to={`/panel/${props.panelId}/lease`}
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Add
                </Button>
            </>
        );
    };

    const menuItems = () => {
        return [
            <MenuItem key="add" component={Link} to={`/panel/${props.panelId}/lease`}>
                <ListItemIcon>
                    <AddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Add Lease" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} isClosed={false} />;
}
