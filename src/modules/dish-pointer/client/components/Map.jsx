import React, { useState, useRef, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import Typography from "@mui/material/Typography";
import geostationaryCalcultation from "./../utils/geostationaryCalcultation";
import AxiosPut from "@utils/AxiosPut";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Map({
    title = "Dish Pointer",
    esLatitude = 51.518788,
    esLongitude = -0.143521,
    satLongitude = 16,
    satLatitude = 0,
    satDirection = "east",
    panelId,
}) {
    const [position, setPosition] = useState({ lat: esLatitude, lng: esLongitude });
    const isMounted = useRef(false);
    const pathOptions = { color: "#e74b3c" };

    //Update the position in the config if changed. Don't run on mount
    useEffect(() => {
        if (isMounted.current) {
            if (position.lat && position.lng) {
                AxiosPut(`/api/panelconfig/${panelId}`, { esLatitude: position.lat, esLongitude: position.lng });
            }
        } else {
            isMounted.current = true;
        }
    }, [position]);

    const getAzimuth = (position) => {
        const { azimuth, elevation } = geostationaryCalcultation(satLongitude, satDirection, position);
        return azimuth;
    };

    const getElevation = (position) => {
        const { azimuth, elevation } = geostationaryCalcultation(satLongitude, satDirection, position);
        return elevation;
    };

    //Marker Icon
    const icon = new Leaflet.Icon({
        iconUrl: "/images/leaflet/marker-icon.png",
        shadowUrl: "/images/leaflet/marker-shadow.png",
        iconAnchor: [17, 40],
        iconSize: [34, 40],
    });

    //Plot Sat Path
    const getPath = (position) => {
        if (position) {
            return [position, [satLatitude, satLongitude]];
        }
        return [];
    };

    function DraggableMarker({ draggable = true, icon, children }) {
        const markerRef = useRef(null);

        //Get Current Location
        const map = useMapEvents({
            click() {
                map.locate();
            },
            locationfound(e) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        //Get Dragged Location
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        setPosition(marker.getLatLng());
                    }
                },
            }),
            []
        );

        return (
            <Marker icon={icon} draggable={draggable} eventHandlers={eventHandlers} position={position} ref={markerRef}>
                {children}
            </Marker>
        );
    }

    return (
        <>
            <MapContainer
                style={{
                    height: "100%",
                }}
                center={[esLatitude, esLongitude]}
                zoom={12}
                scrollWheelZoom={true}
            >
                <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png" />
                <DraggableMarker icon={icon}>
                    <Popup style={{ background: "#262626", color: "#ffffff" }} minWidth={100}>
                        <Typography variant="h6" noWrap>
                            {title}
                        </Typography>
                        <Typography variant="body1" noWrap>
                            <b>Longitude</b> {Math.round(position.lat * 100) / 100}&deg;
                            <br />
                            <b>Latitude</b> {Math.round(position.lng * 100) / 100}&deg;
                        </Typography>

                        <Typography variant="body1" noWrap>
                            <b>
                                {satLongitude}&deg; {capitalizeFirstLetter(satDirection)}
                            </b>
                        </Typography>

                        <Typography variant="body1" noWrap>
                            <b>Azimuth</b> {Math.round(getAzimuth(position) * 100) / 100}&deg;
                            <br />
                            <b>Elevation</b> {Math.round(getElevation(position) * 100) / 100}&deg;
                        </Typography>
                    </Popup>
                </DraggableMarker>
                <Polyline pathOptions={pathOptions} positions={getPath(position)} />
            </MapContainer>
        </>
    );
}
