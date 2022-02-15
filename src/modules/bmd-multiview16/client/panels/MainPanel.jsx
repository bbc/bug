import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import TabLayout from "./TabLayout";
import TabLabels from "./TabLabels";
import TabConfig from "./TabConfig";

export default function MainPanel({ panelId }) {
    return (
        <>
            <BugPanelTabbedForm
                labels={["Layout", "Labels", "Config"]}
                locations={[`/panel/${panelId}/layout`, `/panel/${panelId}/labels`, `/panel/${panelId}/deviceconfig`]}
                content={[
                    <TabLayout panelId={panelId} />,
                    <TabLabels panelId={panelId} />,
                    <TabConfig panelId={panelId} />,
                ]}
                contentProps={{ elevation: 0 }}
            ></BugPanelTabbedForm>
        </>
    );
}
