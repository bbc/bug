import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const MapPanel = React.lazy(() => import("./panels/MapPanel"));
const EditPanel = React.lazy(() => import("./panels/EditPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const HostDetails = React.lazy(() => import("./panels/HostDetails"));

export default function Module(props) {
    return (
        <BugModuleWrapper configPanel={ConfigPanel} {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/map">
                <MapPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/edit">
                <EditPanel {...props} />
            </Route>

            <Route exact path="/panel/:panelId/host/:hostId">
                <HostDetails />
            </Route>
        </BugModuleWrapper>
    );
}
