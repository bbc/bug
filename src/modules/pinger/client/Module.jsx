import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const EditPanel = React.lazy(() => import("./panels/EditPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const HostDetails = React.lazy(() => import("./panels/HostDetails"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel />
            </Route>
            <Route exact path="/panel/:panelId/edit">
                <EditPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/config">
                <ConfigPanel />
            </Route>
            <Route exact path="/panel/:panelId/host/:hostIndex">
                <HostDetails />
            </Route>
        </BugModuleWrapper>
    );
}
