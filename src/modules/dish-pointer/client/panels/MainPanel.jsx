import { useSelector } from "react-redux";
import Map from "../components/Map";

export default function MainPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);
    const satLongitude = (panelConfig.data.satDirection === "west" ? -1 : 1) * Math.abs(panelConfig.data.satLongitude);

    return (
        <Map
            title={panelConfig.data.title}
            esLongitude={panelConfig.data.esLongitude}
            esLatitude={panelConfig.data.esLatitude}
            panelId={panelConfig.data.id}
            satLongitude={satLongitude}
        />
    );
}
