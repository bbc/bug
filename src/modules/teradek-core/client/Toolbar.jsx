import React from "react";
import ToolbarWrapper from "@core/ToolbarWrapper";

export default function Toolbar(props) {
    let toolbarProps = { ...props };

    toolbarProps["onClick"] = null;

    return <ToolbarWrapper {...toolbarProps} isClosed={false} />;
}
