import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import React from "react";
import { Route, Routes } from "react-router-dom";

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
            <Routes>
                <Route index element={<MainPanel {...props} />} />
                <Route path="/map" element={<MapPanel {...props} />} />
                <Route path="/edit" element={<EditPanel {...props} />} />
                <Route path="/host/add" element={<HostAddPanel />} />
                <Route path="/host/:hostId/edit" element={<HostEditPanel />} />
                <Route path="/host/:hostId" element={<HostPanel />} />
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
