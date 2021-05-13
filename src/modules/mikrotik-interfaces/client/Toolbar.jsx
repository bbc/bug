import React from "react";
import PanelToolbar from "@core/PanelToolbar";
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
    return <PanelToolbar {...toolbarProps} isClosed={false} />;
}
