import React, { useRef, useMemo, useState, useEffect } from "react";
import * as ReactDOMServer from "react-dom/server";
import { MapContainer, TileLayer, Popup, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Typography from "@mui/material/Typography";
import { useApiPoller } from "@hooks/ApiPoller";
import Leaflet from "leaflet";
import Avatar from "@mui/material/Avatar";
import AxiosPut from "@utils/AxiosPut";
import hex from "text-hex";

export default function Map({ panelId }) {
    const [startPosition, setStartPosition] = useState({});
    const [centerPosition, setCenterPosition] = useState([51.518642, -0.143735]);

    const traceroutes = useApiPoller({
        url: `/container/${panelId}/traceroute`,
        interval: 5000,
    });

    //Update the position in the config if changed. Don't run on mount
    useEffect(() => {
        const position = {};
        if (traceroutes.status === "success") {
            for (let traceroute of traceroutes.data) {
                position[traceroute?.tracerouteId] = { startPosition: [] };
                position[traceroute?.tracerouteId].startPosition = traceroute?.startPosition;
            }

            setStartPosition(position);
        }
    }, [traceroutes]);

    //Marker Icon
    // const icon = new Leaflet.Icon({
    //     iconUrl: "/images/leaflet/marker-icon.png",
    //     shadowUrl: "/images/leaflet/marker-shadow.png",
    //     iconAnchor: [17, 40],
    //     iconSize: [34, 40],
    // });

    const DraggableMarker = ({ icon, children, tracerouteId }) => {
        const markerRef = useRef(null);

        //Get Dragged Location
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    const endPosition = marker.getLatLng();

                    if (marker != null) {
                        const newPosition = Object.assign(startPosition);
                        newPosition[tracerouteId]?.startPosition[(endPosition?.lat, endPosition?.lng)];
                        setStartPosition(newPosition);
                        if (endPosition.lat && endPosition.lng) {
                            console.log(newPosition);
                            //AxiosPut(`/container/${panelId}/traceroute/${tracerouteId}`, newPosition[tracerouteId]);
                        }
                    }
                },
            }),
            []
        );

        return (
            <Marker
                icon={icon}
                draggable={true}
                eventHandlers={eventHandlers}
                position={startPosition[tracerouteId]?.startPosition}
                ref={markerRef}
            >
                {children}
            </Marker>
        );
    };

    const getMakers = () => {
        const markers = [];

        if (traceroutes.status === "success" && Object.keys(startPosition).length !== 0) {
            for (let traceroute of traceroutes.data) {
                let hops = 1;
                const color = hex(traceroute?.tracerouteId);
                if (traceroute.hops) {
                    for (let hop of traceroute.hops) {
                        if (hop.loc) {
                            const icon = new Leaflet.divIcon({
                                className: "icon",
                                html: ReactDOMServer.renderToString(<Avatar sx={{ bgcolor: color }}>{hops}</Avatar>),
                                iconAnchor: [20, 15],
                                iconSize: [30, 30],
                            });
                            if (hops === 1) {
                                markers.push(
                                    <DraggableMarker
                                        icon={icon}
                                        key={`${hops}${traceroute._id}`}
                                        tracerouteId={traceroute?.tracerouteId}
                                    >
                                        <Popup>
                                            <Typography variant="h5">
                                                {hops} | {traceroute.name}
                                            </Typography>
                                            <Typography variant="body2"> {hop.address}</Typography>
                                            <Typography variant="body1">
                                                {hop.city}, {hop.region}
                                            </Typography>
                                            <Typography variant="body1">{hop.country}</Typography>
                                            <Typography variant="body1">{hop.org}</Typography>
                                        </Popup>
                                    </DraggableMarker>
                                );
                            } else {
                                markers.push(
                                    <Marker icon={icon} key={`${hops}${traceroute._id}`} position={hop.loc}>
                                        <Popup>
                                            <Typography variant="h5">
                                                {hops} | {traceroute.name}
                                            </Typography>
                                            <Typography variant="body2"> {hop.address}</Typography>
                                            <Typography variant="body1">
                                                {hop.city}, {hop.region}
                                            </Typography>
                                            <Typography variant="body1">{hop.country}</Typography>
                                            <Typography variant="body1">{hop.org}</Typography>
                                        </Popup>
                                    </Marker>
                                );
                            }
                            hops++;
                        }
                    }
                }
            }
        }
        return markers;
    };

    const getLines = () => {
        const lines = [];
        if (traceroutes.status === "success") {
            for (let traceroute of traceroutes.data) {
                const positions = [];
                const color = hex(traceroute?.tracerouteId);
                if (traceroute.hops) {
                    for (let hop of traceroute.hops) {
                        if (hop.loc) {
                            positions.push(hop.loc);
                        }
                    }
                }
                lines.push(
                    <Polyline key={traceroute?.tracerouteId} pathOptions={{ color: color }} positions={positions} />
                );
            }
        }
        return lines;
    };

    return (
        <>
            <MapContainer
                style={{
                    height: "100%",
                }}
                center={centerPosition}
                zoom={12}
                scrollWheelZoom={true}
            >
                <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png" />
                {getMakers()}
                {getLines()}
            </MapContainer>
        </>
    );
}
