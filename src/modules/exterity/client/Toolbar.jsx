import React, { useState } from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import ChannelButton from "./components/ChannelButton";
import DeviceButton from "./components/DeviceButton";

export default function Toolbar({ panelId, ...props }) {
    let toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    toolbarProps["onClick"] = null;

    const buttons = () => (
        <>
            <DeviceButton panelId={panelId}></DeviceButton>
            <ChannelButton panelId={panelId}></ChannelButton>
        </>
    );

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = null;
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
