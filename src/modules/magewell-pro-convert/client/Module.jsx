import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import BugModuleWrapper from "@core/BugModuleWrapper";
import BugModuleRoute from "@core/BugModuleRoute";

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <BugModuleRoute exact path="/panel/:panelId/device">
                <MainPanel />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/network">
                <MainPanel />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/config">
                <ConfigPanel />
            </BugModuleRoute>
        </BugModuleWrapper>
    );
}
