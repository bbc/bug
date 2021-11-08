import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useApiPoller } from "@utils/ApiPoller";
import SaveIcon from "@mui/icons-material/Save";

export default function Toolbar(props) {
    const pending = useApiPoller({
        url: `/container/${props.panelId}/pending/`,
        interval: 1000,
    });

    const isPending = pending.status === "success" && pending.data;

    let toolbarProps = { ...props };

    const buttons = () => (
        <>
            <Button
                disabled={!isPending}
                variant="outlined"
                color={isPending ? "warning" : "primary"}
                startIcon={<SaveIcon />}
            >
                Save
            </Button>
        </>
    );

    const menuItems = () => {
        return [
            <MenuItem disabled={!isPending}>
                <ListItemIcon>
                    <SaveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Save" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} isClosed={false} />;
}
