import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import React from "react";
import { Route, Routes } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const InterfacePanel = React.lazy(() => import("./panels/InterfacePanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Routes>
                <Route index element={<MainPanel {...props} />} />
                <Route path="/interface/:interfaceId" element={<InterfacePanel />} />
                <Route path="/interface/:interfaceId/:tab" element={<InterfacePanel />} />
                <Route
                    path="config"
                    element={
                        <BugRestrictTo role="admin">
                            <ConfigPanel {...props} />
                        </BugRestrictTo>
                    }
                />
                <Route path="/:stackId" element={<MainPanel {...props} />} />
            </Routes>
        </BugModuleWrapper>
    );
}
