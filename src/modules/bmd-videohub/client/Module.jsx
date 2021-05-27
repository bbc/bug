import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import ModuleWrapper from "@core/ModuleWrapper";
import ModuleRoute from "@core/ModuleRoute";

export default function Module(props) {
    return (
        <ModuleWrapper {...props}>
            <ModuleRoute exact path="/panel/:panelId">
                <MainPanel {...props} />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/config">
                <ConfigPanel {...props} />
            </ModuleRoute>
        </ModuleWrapper>
    );
}
