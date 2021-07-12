import React from "react";
import ToolbarWrapper from "@core/ToolbarWrapper";
// import Button from "@material-ui/core/Button";
// import MenuItem from "@material-ui/core/MenuItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";

export default function Toolbar(props) {
    let toolbarProps = { ...props };

    const buttons = () => null;

    const menuItems = () => null;

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <ToolbarWrapper {...toolbarProps} isClosed={false} />;
}
