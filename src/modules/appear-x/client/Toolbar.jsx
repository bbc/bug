import { Route, Switch } from "react-router-dom";
import ListToolbar from "./toolbars/ListToolbar";
import MpegEncoderToolbar from "./toolbars/MpegEncoderToolbar";

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
