import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import React from "react";
import { Route, Routes } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const LeasePanel = React.lazy(() => import("./panels/LeasePanel"));
const NewLeasePanel = React.lazy(() => import("./panels/NewLeasePanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Routes>
                <Route index element={<MainPanel {...props} />} />
                <Route path="/lease/:leaseId" element={<LeasePanel {...props} />} />
                <Route path="/lease/" element={<NewLeasePanel {...props} />} />
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
