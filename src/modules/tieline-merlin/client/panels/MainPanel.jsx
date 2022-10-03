import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import TabConnect from "./TabConnect";
import TabStatistics from "./TabStatistics";
import TabPrograms from "./TabPrograms";

export default function MainPanel({ panelId }) {
    return (
        <>
            <BugPanelTabbedForm
                labels={["Connections", "Statistics", "Programs"]}
                locations={[
                    `/panel/${panelId}/display/connect`,
                    `/panel/${panelId}/display/statistics`,
                    `/panel/${panelId}/display/programs`,
                ]}
                content={[
                    <TabConnect panelId={panelId} />,
                    <TabStatistics panelId={panelId} />,
                    <TabPrograms panelId={panelId} />,
                ]}
            ></BugPanelTabbedForm>
        </>
    );
}
