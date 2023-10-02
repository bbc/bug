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
import LabelIcon from "@mui/icons-material/Label";
import Divider from "@mui/material/Divider";
import { useSelector } from "react-redux";
import AxiosPut from "@utils/AxiosPut";
import AxiosCommand from "@utils/AxiosCommand";
import { useHistory } from "react-router-dom";

export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const location = useLocation();
    const panelStatus = usePanelStatus();
    const panelConfig = useSelector((state) => state.panelConfig);
    const history = useHistory();

    if (!panelStatus) {
        return null;
    }

    const editMode = location.pathname.indexOf("/edit") > -1;

    const handleOverwriteLabels = async (event, item) => {
        await AxiosCommand(`/container/${panelId}/databaselabels`);
    };

    const handleUseTakeClicked = async (event, item) => {
        await AxiosPut(`/api/panelconfig/${panelId}`, {
            useTake: !panelConfig?.data?.useTake,
        });
    };

    const handleEditClicked = (event, item) => {
        const params = getParams(5);
        history.push(`/panel/${panelId}/edit/${params}`);
    };

    const handleDoneClicked = (event, item) => {
        const params = getParams(6);
        history.push(`/panel/${panelId}/${params}`);
    };

    const getParams = (matchCount) => {
        const urlParts = location.pathname.split("/");
        if (urlParts.length === matchCount) {
            return urlParts.slice(-2).join("/");
        }
        return "";
    };

    const buttons = () => (
        <>
            {editMode ? (
                <Button variant="outlined" color="primary" startIcon={<DoneIcon />} onClick={handleDoneClicked}>
                    Done
                </Button>
            ) : (
                <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={handleEditClicked}>
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
            <MenuItem key="overwriteLabels" onClick={handleOverwriteLabels}>
                <ListItemIcon>
                    <LabelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Overwrite Labels" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
