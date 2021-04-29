import React from "react";
import MainPanel from "./panels/MainPanel";
import EditPanel from "./panels/EditPanel";
import InterfacePanel from "./panels/InterfacePanel";
import { Switch, Route } from "react-router-dom";
import ModuleWrapper from "@core/ModuleWrapper";

export default function Module({ panelId }) {

    return (
        <ModuleWrapper panelId={panelId}>
            <Switch>
                <Route exact path="/panel/:panelId/">
                    <MainPanel />
                </Route>
                <Route exact path="/panel/:panelId/edit">
                    <EditPanel />
                </Route>
                <Route exact path="/panel/:panelId/interface/:interfaceId">
                    <InterfacePanel />
                </Route>
            </Switch>
        </ModuleWrapper>
    );
}
