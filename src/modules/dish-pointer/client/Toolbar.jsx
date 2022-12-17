import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";

export default function Toolbar(props) {
    let toolbarProps = { ...props };

    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
