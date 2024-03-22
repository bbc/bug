import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId/display/:tab">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/display/:tab/:sourceGroup/:destinationGroup">
                <MainPanel editMode={false} {...props} />
            </Route>
            <Route exact path="/panel/:panelId/edit/">
                <MainPanel editMode={true} {...props} />
            </Route>
            <Route exact path="/panel/:panelId/edit/display/:tab">
                <MainPanel editMode={true} {...props} />
            </Route>
            <Route exact path="/panel/:panelId/edit/display/:tab/:sourceGroup/:destinationGroup">
                <MainPanel editMode={true} {...props} />
            </Route>
            <Route exact path="/panel/:panelId/config">
                <ConfigPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId">
                <MainPanel {...props} />
            </Route>
        </BugModuleWrapper>
    );
}
