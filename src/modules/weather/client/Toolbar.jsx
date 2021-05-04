import React from "react";
import PanelToolbar from "@core/PanelToolbar";

export default function Toolbar(props) {

    let toolbarProps = {...props};

    toolbarProps['onClick'] = null;

    return <PanelToolbar {...toolbarProps} isClosed={false}/>;
}