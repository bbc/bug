import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { useSelector } from "react-redux";

export default function Toolbar(props) {
    let toolbarProps = { ...props };
    const panelConfig = useSelector((state) => state.panelConfig);

    toolbarProps["onClick"] = null;

    const menuItems = () => null;

    toolbarProps["buttons"] = null;
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
