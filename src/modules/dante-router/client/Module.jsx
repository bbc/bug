import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import React from "react";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));
const EditPanel = React.lazy(() => import("./panels/EditPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Routes>
                <Route index element={<MainPanel {...props} />} />
                <Route path="/:transmitterGroup/:receiverGroup" element={<MainPanel {...props} />} />
                <Route path="/edit" element={<EditPanel {...props} />} />
                <Route path="/edit/:transmitterGroup/:receiverGroup" element={<EditPanel {...props} />} />
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
