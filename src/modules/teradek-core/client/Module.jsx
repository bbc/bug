import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
import DecoderPanel from "./panels/DecoderPanel";
import EncoderPanel from "./panels/EncoderPanel";
import ModuleWrapper from "@core/ModuleWrapper";
import ModuleRoute from "@core/ModuleRoute";

export default function Module(props) {
    return (
        <ModuleWrapper {...props}>
            <ModuleRoute exact path="/panel/:panelId">
                <MainPanel />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/config">
                <ConfigPanel />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/encoder/:encoderId">
                <EncoderPanel />
            </ModuleRoute>
            <ModuleRoute exact path="/panel/:panelId/decoder/:decoderId">
                <DecoderPanel />
            </ModuleRoute>
        </ModuleWrapper>
    );
}
