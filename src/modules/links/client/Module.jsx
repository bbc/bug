import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const LinkPanel = React.lazy(() => import("./panels/LinkPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel />
            </Route>
            <Route exact path="/panel/:panelId/config">
                <ConfigPanel />
            </Route>
            <Route exact path="/panel/:panelId/link/:linkIndex">
                <LinkPanel />
            </Route>
        </BugModuleWrapper>
    );
}
