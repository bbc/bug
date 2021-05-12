import React from "react";
import MainPanel from "./panels/MainPanel";
import EditPanel from "./panels/EditPanel";
import InterfacePanel from "./panels/InterfacePanel";
import ModuleWrapper from "@core/ModuleWrapper";
import ModuleRoute from "@core/ModuleRoute";

export default function Module(props) {

    return (
        <ModuleWrapper {...props}>
            <ModuleRoute exact path="/panel/:panelId">
                <MainPanel />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/edit">
                <EditPanel />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/interface/:interfaceName">
                <InterfacePanel />
            </ModuleRoute>
        </ModuleWrapper>
    );
}