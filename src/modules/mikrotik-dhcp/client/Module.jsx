import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const LeasePanel = React.lazy(() => import("./panels/LeasePanel"));
const NewLeasePanel = React.lazy(() => import("./panels/NewLeasePanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper configPanel={ConfigPanel} {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel />
            </Route>

            <Route exact path="/panel/:panelId/lease/:leaseId">
                <LeasePanel />
            </Route>
            <Route exact path="/panel/:panelId/lease/">
                <NewLeasePanel />
            </Route>
        </BugModuleWrapper>
    );
}
