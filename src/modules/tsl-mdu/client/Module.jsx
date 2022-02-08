import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import OutputPanel from "./panels/OutputPanel";
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
            <Route exact path="/panel/:panelId/output/:outputNumber">
                <OutputPanel />
            </Route>
        </BugModuleWrapper>
    );
}
