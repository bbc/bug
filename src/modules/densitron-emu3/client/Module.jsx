import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import BugModuleWrapper from "@core/BugModuleWrapper";
import BugModuleRoute from "@core/BugModuleRoute";

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <BugModuleRoute exact path="/panel/:panelId">
                <MainPanel {...props} />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/config">
                <ConfigPanel {...props} />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/:deviceIndex">
                <MainPanel {...props} />
            </BugModuleRoute>
        </BugModuleWrapper>
    );
}
