import React from "react";
import { Switch, Route } from "react-router-dom";
import MpegEncoderToolbar from "./toolbars/MpegEncoderToolbar";
import ListToolbar from "./toolbars/ListToolbar";

export default function Toolbar(props) {
    return (
        <Switch>
            <Route exact path="/panel/:panelId">
                <ListToolbar {...props} />
            </Route>
            <Route exact path="/panel/:panelId/display/:tab">
                <ListToolbar {...props} />
            </Route>
            <Route exact path="/panel/:panelId/mpegencoder/:serviceId">
                <MpegEncoderToolbar {...props} />
            </Route>
            <Route exact path="/panel/:panelId/config">
                <> </>
            </Route>
        </Switch>
    );
}
