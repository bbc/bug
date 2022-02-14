import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import { usePanelStatus } from "@hooks/PanelStatus";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";
import Divider from "@mui/material/Divider";
import { useSelector } from "react-redux";
import AxiosPut from "@utils/AxiosPut";

export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const location = useLocation();
    const panelStatus = usePanelStatus();
    const panelConfig = useSelector((state) => state.panelConfig);

    if (!panelStatus) {
        return null;
    }

    const editMode = location.pathname.indexOf("/edit") > -1;

    const handleUseTakeClicked = async (event, item) => {
        await AxiosPut(`/api/panelconfig/${panelId}`, {
            useTake: !panelConfig?.data?.useTake,
        });
    };

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

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            <MenuItem key="usetake" onClick={handleUseTakeClicked}>
                <ListItemIcon>{panelConfig?.data?.useTake ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
                <ListItemText primary="Confirm Take" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
