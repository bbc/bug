import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import React from "react";
import { Route, Routes } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Routes>
                <Route index element={<MainPanel {...props} />} />
                <Route path="/display/:tab" element={<MainPanel {...props} />} />
                <Route
                    path="/display/:tab/:sourceGroup/:destinationGroup"
                    element={<MainPanel editMode={false} {...props} />}
                />
                <Route path="/edit/" element={<MainPanel editMode={true} {...props} />} />
                <Route path="/edit/display/:tab" element={<MainPanel editMode={true} {...props} />} />
                <Route
                    path="/edit/display/:tab/:sourceGroup/:destinationGroup"
                    element={<MainPanel editMode={true} {...props} />}
                />
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
