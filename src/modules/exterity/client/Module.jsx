import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import React from "react";
import { Route, Routes } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const ChannelEditPanel = React.lazy(() => import("./panels/ChannelEditPanel"));
const DeviceEditPanel = React.lazy(() => import("./panels/DeviceEditPanel"));
const ChannelAddPanel = React.lazy(() => import("./panels/ChannelAddPanel"));
const DeviceAddPanel = React.lazy(() => import("./panels/DeviceAddPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Routes>
                <Route index element={<MainPanel {...props} />} />
                <Route path="/display/:tab" element={<MainPanel {...props} />} />
                <Route path="/channels/edit/:channelId" element={<ChannelEditPanel {...props} />} />
                <Route path="/devices/edit/:deviceId" element={<DeviceEditPanel {...props} />} />
                <Route path="/channels/add" element={<ChannelAddPanel {...props} />} />
                <Route path="/devices/add" element={<DeviceAddPanel {...props} />} />
                <Route
                    path="config"
                    element={
                        <BugRestrictTo role="admin">
                            <ConfigPanel {...props} />
                        </BugRestrictTo>
                    }
                />
            </Routes>
        </BugModuleWrapper>
    );
}
