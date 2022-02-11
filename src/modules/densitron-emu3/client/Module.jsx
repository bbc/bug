import React from "react";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/config">
                <ConfigPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/:deviceIndex">
                <MainPanel {...props} />
            </Route>
        </BugModuleWrapper>
    );
}
