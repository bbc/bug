import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import TabConnect from "./TabConnect";
import TabStatistics from "./TabStatistics";
import TabGraphs from "./TabGraphs";
import TabPrograms from "./TabPrograms";

export default function MainPanel({ panelId }) {
    return (
        <>
            <BugPanelTabbedForm
                labels={["Connect", "Statistics", "Graphs", "Programs"]}
                locations={[
                    `/panel/${panelId}/display/connect`,
                    `/panel/${panelId}/display/statistics`,
                    `/panel/${panelId}/display/graphs`,
                    `/panel/${panelId}/display/programs`,
                ]}
                content={[
                    <TabConnect panelId={panelId} />,
                    <TabStatistics panelId={panelId} />,
                    <TabGraphs panelId={panelId} />,
                    <TabPrograms panelId={panelId} />,
                ]}
                contentProps={{ elevation: 0, sx: { backgroundColor: "red" } }}
            ></BugPanelTabbedForm>
        </>
    );
}
