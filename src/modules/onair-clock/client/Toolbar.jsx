import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { useSelector } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Popover from "@mui/material/Popover";
import Iframe from "react-iframe";

export default function Toolbar(props) {
    let toolbarProps = { ...props };
    const panelConfig = useSelector((state) => state.panelConfig);

    toolbarProps["onClick"] = null;

    const handleWebpageClicked = async (event) => {
        const url = `./../container/g1kz5wxo8p59smk/clock/large`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    const menuItems = () => [
        <MenuItem onClick={handleWebpageClicked} key="launch">
            <ListItemIcon>
                <OpenInNewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Goto Webpage" />
        </MenuItem>,
    ];

    const buttons = () => [];

    toolbarProps["buttons"] = null;
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} isClosed={false} />;
}
