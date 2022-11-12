import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";

export default function Toolbar(props) {
    let toolbarProps = { ...props };

    const buttons = () => null;

    const menuItems = () => null;

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
