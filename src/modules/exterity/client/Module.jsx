import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const ChannelPanel = React.lazy(() => import("./panels/ChannelPanel"));
const DevicePanel = React.lazy(() => import("./panels/DevicePanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/config">
                <ConfigPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/:tab">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/channels/:channelId">
                <ChannelPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/devices/:deviceId">
                <DevicePanel {...props} />
            </Route>
        </BugModuleWrapper>
    );
}
