import React from "react";
import { useHistory } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function BugToolbarLogsButton({ panelId }) {
    const history = useHistory();

    const handleLogsClicked = (event, item) => {
        history.push(`/system/logs/${panelId}`);
    };

    return (
        <MenuItem key="launch" onClick={handleLogsClicked}>
            <ListItemIcon>
                <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View Logs" />
        </MenuItem>
    );
}
