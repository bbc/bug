import BugModuleWrapper from "@core/BugModuleWrapper";
import BugRestrictTo from "@core/BugRestrictTo";
import React from "react";
import { Route } from "react-router-dom";

const MainPanel = React.lazy(() => import("./panels/MainPanel"));
const MpegEncoderPanel = React.lazy(() => import("./panels/MpegEncoderPanel"));
const ConfigPanel = React.lazy(() => import("./panels/ConfigPanel"));

export default function Module(props) {
    return (
        <BugModuleWrapper {...props}>
            <Route exact path="/panel/:panelId">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/display/:tab">
                <MainPanel {...props} />
            </Route>
            <Route exact path="/panel/:panelId/mpegencoder/:serviceId">
                <MpegEncoderPanel {...props} />
            </Route>
            <BugRestrictTo role="admin">
                <Route exact path="/panel/:panelId/config">
                    <ConfigPanel {...props} />
                </Route>
            </BugRestrictTo>
        </BugModuleWrapper>
    );
}
