import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import EditPanel from "./panels/EditPanel";
import ModuleWrapper from "@core/ModuleWrapper";
import ModuleRoute from "@core/ModuleRoute";

export default function Module(props) {
    return (
        <ModuleWrapper {...props}>
            <ModuleRoute exact path="/panel/:panelId">
                <MainPanel {...props} />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/:sourceGroup/:destinationGroup">
                <MainPanel {...props} />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/edit">
                <EditPanel {...props} />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/edit/:sourceGroup/:destinationGroup">
                <EditPanel {...props} />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/config">
                <ConfigPanel {...props} />
            </ModuleRoute>
        </ModuleWrapper>
    );
}
