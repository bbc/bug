import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
// import Button from "@mui/material/Button";
// import MenuItem from "@mui/material/MenuItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";

export default function Toolbar(props) {
    let toolbarProps = { ...props };

    const buttons = () => null;

    const menuItems = () => null;

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} isClosed={false} />;
}
