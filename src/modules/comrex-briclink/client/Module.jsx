import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import React from "react";
import { Route, Routes } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const PeerPanel = React.lazy(() => import("./panels/PeerPanel"));
const PeerAddPanel = React.lazy(() => import("./panels/PeerAddPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Routes>
                <Route index element={<MainPanel {...props} />} />

                <Route path="/connection/:peerId" element={<PeerPanel {...props} />} />
                <Route path="/connection/" element={<PeerAddPanel {...props} />} />
                <Route path="/display/:tab" element={<MainPanel {...props} />} />
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
