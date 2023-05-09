import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";

export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const panelStatus = usePanelStatus();

    if (!panelStatus) {
        return null;
    }

    const buttons = () => {};
    const menuItems = () => {};

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
