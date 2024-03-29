import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const InterfacePanel = React.lazy(() => import("./panels/InterfacePanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/interface/:interfaceId">
                <InterfacePanel />
            </Route>
            <Route exact path="/panel/:panelId/interface/:interfaceId/:tab">
                <InterfacePanel />
            </Route>
            <BugRestrictTo role="admin">
                <Route exact path="/panel/:panelId/config">
                    <ConfigPanel />
                </Route>
            </BugRestrictTo>
            <Route exact path="/panel/:panelId/:stackId">
                <MainPanel {...props} />
            </Route>
        </BugModuleWrapper>
    );
}
