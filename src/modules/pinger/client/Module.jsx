import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const MapPanel = React.lazy(() => import("./panels/MapPanel"));
const EditPanel = React.lazy(() => import("./panels/EditPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const HostPanel = React.lazy(() => import("./panels/HostPanel"));
const HostEditPanel = React.lazy(() => import("./panels/HostEditPanel"));
const HostAddPanel = React.lazy(() => import("./panels/HostAddPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/map">
                <MapPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/edit">
                <EditPanel {...props} />
            </Route>

            <Route exact path="/panel/:panelId/host/add">
                <HostAddPanel />
            </Route>
            <Route exact path="/panel/:panelId/host/:hostId/edit">
                <HostEditPanel />
            </Route>
            <Route exact path="/panel/:panelId/host/:hostId">
                <HostPanel />
            </Route>

            <BugRestrictTo role="admin">
                <Route exact path="/panel/:panelId/config">
                    <ConfigPanel />
                </Route>
            </BugRestrictTo>
        </BugModuleWrapper>
    );
}
