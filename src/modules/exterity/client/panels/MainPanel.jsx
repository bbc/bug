import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import TabChannels from "./TabChannels";
import TabDevices from "./TabDevices";

export default function MainPanel({ panelId }) {
    return (
        <>
            <BugPanelTabbedForm
                labels={["Channels", "Devices"]}
                locations={[`/panel/${panelId}/display/channels`, `/panel/${panelId}/display/devices`]}
                content={[<TabChannels panelId={panelId} />, <TabDevices panelId={panelId} />]}
                contentProps={{ elevation: 0 }}
            ></BugPanelTabbedForm>
        </>
    );
}
