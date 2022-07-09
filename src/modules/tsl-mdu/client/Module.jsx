import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const OutputPanel = React.lazy(() => import("./panels/OutputPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper configPanel={ConfigPanel} {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel />
            </Route>

            <Route exact path="/panel/:panelId/output/:outputNumber">
                <OutputPanel />
            </Route>
        </BugModuleWrapper>
    );
}
