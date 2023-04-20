import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const EditPanel = React.lazy(() => import("./panels/EditPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/:transmitterGroup/:receiverGroup">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/edit">
                <EditPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/edit/:transmitterGroup/:receiverGroup">
                <EditPanel {...props} />
            </Route>
            <BugRestrictTo role="admin">
                <Route exact path="/panel/:panelId/config">
                    <ConfigPanel />
                </Route>
            </BugRestrictTo>
        </BugModuleWrapper>
    );
}
