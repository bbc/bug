import React from "react";
import Map from "../components/Map";
import { useSelector } from "react-redux";

export default function MainPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    return (
        <Map
            title={panelConfig.data.title}
            esLongitude={panelConfig.data.esLongitude}
            esLatitude={panelConfig.data.esLatitude}
        />
    );
}
