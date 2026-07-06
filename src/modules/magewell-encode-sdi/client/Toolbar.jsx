import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import CheckIcon from "@mui/icons-material/Check";
import { Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useSelector } from "react-redux";

export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    const panelConfig = useSelector((state) => state.panelConfig);

    if (!panelStatus) {
        return null;
    }

    const handleShowAdvancedClicked = async () => {
        await AxiosPut(`/api/panelconfig/${panelId}`, {
            showAdvanced: !panelConfig?.data?.showAdvanced,
        });
    };

    const buttons = () => {};
    const menuItems = () => {
        return [
            <Divider key="divider" />,
            <MenuItem key="showadvanced" onClick={handleShowAdvancedClicked}>
                <ListItemIcon>{panelConfig?.data?.showAdvanced ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
                <ListItemText primary="Show Advanced" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
