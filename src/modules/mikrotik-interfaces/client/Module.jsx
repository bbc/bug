import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const InterfacePanel = React.lazy(() => import("./panels/InterfacePanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper configPanel={ConfigPanel} {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel />
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
