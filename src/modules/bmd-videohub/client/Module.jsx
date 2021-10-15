import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import EditPanel from "./panels/EditPanel";
import BugModuleWrapper from "@core/BugModuleWrapper";
import BugModuleRoute from "@core/BugModuleRoute";

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <BugModuleRoute exact path="/panel/:panelId">
                <MainPanel {...props} />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/:sourceGroup/:destinationGroup">
                <MainPanel {...props} />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/edit">
                <EditPanel {...props} />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/edit/:sourceGroup/:destinationGroup">
                <EditPanel {...props} />
            </BugModuleRoute>
            <BugModuleRoute exact path="/panel/:panelId/config">
                <ConfigPanel {...props} />
            </BugModuleRoute>
        </BugModuleWrapper>
    );
}
