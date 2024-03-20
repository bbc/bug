import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import TabRouter from "../components/TabRouter";
import TabModules from "../components/TabModules";
import TabDevice from "../components/TabDevice";

export default function MainPanel({ panelId }) {
    return (
        <>
            <BugPanelTabbedForm
                fullHeight
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
                labels={["Router", "Modules", "Device"]}
                locations={[
                    `/panel/${panelId}/display/router`,
                    `/panel/${panelId}/display/modules`,
                    `/panel/${panelId}/display/device`,
                ]}
                content={[
                    <TabRouter panelId={panelId} />,
                    <TabModules panelId={panelId} />,
                    <TabDevice panelId={panelId} />,
                ]}
                contentProps={{ elevation: 0 }}
            ></BugPanelTabbedForm>
        </>
    );
}
