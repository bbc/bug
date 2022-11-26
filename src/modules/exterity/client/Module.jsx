import React from "react";
import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const ChannelEditPanel = React.lazy(() => import("./panels/ChannelEditPanel"));
const DeviceEditPanel = React.lazy(() => import("./panels/DeviceEditPanel"));
const ChannelAddPanel = React.lazy(() => import("./panels/ChannelAddPanel"));
const DeviceAddPanel = React.lazy(() => import("./panels/DeviceAddPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/display/:tab">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/channels/edit/:channelId">
                <ChannelEditPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/devices/edit/:deviceId">
                <DeviceEditPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/channels/add">
                <ChannelAddPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/devices/add">
                <DeviceAddPanel {...props} />
            </Route>
            <BugRestrictTo role="admin">
                <Route exact path="/panel/:panelId/config">
                    <ConfigPanel {...props} />
                </Route>
            </BugRestrictTo>
        </BugModuleWrapper>
    );
}
