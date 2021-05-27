import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import InterfacePanel from "./panels/InterfacePanel";
import ModuleWrapper from "@core/ModuleWrapper";
import ModuleRoute from "@core/ModuleRoute";

export default function Module(props) {
    return (
        <ModuleWrapper {...props}>
            <ModuleRoute exact path="/panel/:panelId">
                <MainPanel />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/config">
                <ConfigPanel />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/interface/:interfaceName">
                <InterfacePanel />
            </ModuleRoute>
        </ModuleWrapper>
    );
}
