import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import InterfacePanel from "./panels/InterfacePanel";
import BugModuleWrapper from "@core/BugModuleWrapper";
import { Route } from "react-router-dom";

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel />
            </Route>
            <Route exact path="/panel/:panelId/config">
                <ConfigPanel />
            </Route>
            <Route exact path="/panel/:panelId/interface/:interfaceName">
                <InterfacePanel />
            </Route>
            <Route exact path="/panel/:panelId/interface/:interfaceName/:tab">
                <InterfacePanel />
            </Route>
        </BugModuleWrapper>
    );
}
