import { Route, Routes } from "react-router-dom";
import ListToolbar from "./toolbars/ListToolbar";
import MpegEncoderToolbar from "./toolbars/MpegEncoderToolbar";

export default function Toolbar(props) {
    return (
        <Routes>
            <Route path="/panel/:panelId" element={<ListToolbar {...props} />} />
            <Route path="/panel/:panelId/display/:tab" element={<ListToolbar {...props} />} />
            <Route path="/panel/:panelId/mpegencoder/:serviceId" element={<MpegEncoderToolbar {...props} />} />
            <Route path="/panel/:panelId/config" element={<> </>} />
        </Routes>
    );
}
