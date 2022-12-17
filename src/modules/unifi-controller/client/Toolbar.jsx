import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";

export default function Toolbar(props) {
    let toolbarProps = { ...props };

    toolbarProps["onClick"] = null;

    const menuItems = () => null;

    toolbarProps["buttons"] = null;
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
