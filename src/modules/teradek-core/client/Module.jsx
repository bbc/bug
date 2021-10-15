import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import BugModuleWrapper from "@core/BugModuleWrapper";
import BugModuleRoute from "@core/BugModuleRoute";

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <BugModuleRoute exact path="/panel/:panelId">
                <MainPanel />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/encoders">
                <MainPanel />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/decoders">
                <MainPanel />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/sputniks">
                <MainPanel />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/config">
                <ConfigPanel />
            </BugModuleRoute>
        </BugModuleWrapper>
    );
}
