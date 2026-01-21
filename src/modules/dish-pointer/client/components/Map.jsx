import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";
import { Typography } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import geostationaryCalculation from "../utils/geostationary-calculation";

// helper to update map view when Redux props change.
function MapSync({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

// connects the toolbar "Locate" button to leaflet GPS logic.
function ToolbarActionHandler({ onLocationFound }) {
    const map = useMap();
    const { enqueueSnackbar } = useSnackbar();

    // listen for the "locate" event from the global toolbar
    usePanelToolbarEvent("locate", () => {
        enqueueSnackbar("Acquiring GPS fix...", { variant: "info", autoHideDuration: 2000 });
        map.locate({
            enableHighAccuracy: true,
            setView: true,
            maxZoom: 16,
        });
    });

    useMapEvents({
        locationfound(e) {
            onLocationFound(e);
            if (e.accuracy > 100) {
                enqueueSnackbar("Low accuracy fix. Azimuth may be imprecise.", { variant: "warning" });
            } else {
                enqueueSnackbar("Location updated", { variant: "success" });
            }
        },
        locationerror(e) {
            enqueueSnackbar(e.message, { variant: "error" });
        },
    });

    return null;
}

// marker icon setup - static to avoid re-renders
const markerIcon = new Leaflet.Icon({
    iconUrl: "/images/leaflet/marker-icon.png",
    shadowUrl: "/images/leaflet/marker-shadow.png",
    iconAnchor: [17, 40],
    iconSize: [34, 40],
});

export default function Map({
    title = "Dish Pointer",
    esLatitude = 51.518788,
    esLongitude = -0.143521,
    satLongitude = 16,
    satLatitude = 0,
    panelId,
}) {
    const [position, setPosition] = useState({ lat: esLatitude, lng: esLongitude });
    const [accuracy, setAccuracy] = useState(null);
    const isMounted = useRef(false);

    const pathOptions = { color: "#e74b3c", weight: 3, dashArray: "5, 10" };

    // sync state if Redux props change
    useEffect(() => {
        setPosition({ lat: esLatitude, lng: esLongitude });
    }, [esLatitude, esLongitude]);

    // update panel config when position changes
    useEffect(() => {
        if (isMounted.current) {
            if (position.lat && position.lng) {
                AxiosPut(`/api/panelconfig/${panelId}`, { esLatitude: position.lat, esLongitude: position.lng });
            }
        } else {
            isMounted.current = true;
        }
    }, [position, panelId]);

    const getAzimuth = (pos) => geostationaryCalculation(satLongitude, pos).azimuth;
    const getElevation = (pos) => geostationaryCalculation(satLongitude, pos).elevation;

    const getPath = (pos) => {
        return pos
            ? [
                  [pos.lat, pos.lng],
                  [satLatitude, satLongitude],
              ]
            : [];
    };

    // draggable marker sub-component
    function DraggableMarker({ children }) {
        const markerRef = useRef(null);

        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        const newPos = marker.getLatLng();
                        setPosition(newPos);

                        // clear accuracy circle on manual drag
                        setAccuracy(null);
                    }
                },
            }),
            []
        );

        return (
            <Marker
                icon={markerIcon}
                draggable={true}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}
            >
                {children}
            </Marker>
        );
    }

    return (
        <div id="map-wrapper" style={{ height: "100%", width: "100%", position: "relative" }}>
            <MapContainer
                key={panelId}
                style={{ height: "100%", width: "100%" }}
                center={[esLatitude, esLongitude]}
                zoom={16}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Handlers */}
                <MapSync lat={esLatitude} lng={esLongitude} />
                <ToolbarActionHandler
                    onLocationFound={(e) => {
                        setPosition(e.latlng);
                        setAccuracy(e.accuracy);
                    }}
                />

                {accuracy && (
                    <Circle
                        center={position}
                        radius={accuracy}
                        pathOptions={{ fillColor: "#2196f3", fillOpacity: 0.15, color: "#2196f3", weight: 1 }}
                    />
                )}

                <DraggableMarker>
                    <Popup minWidth={160}>
                        <div style={{ color: "#262626" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" sx={{ borderTop: "1px solid #eee", pt: 1 }}>
                                <b>Lat:</b> {position.lat.toFixed(5)}&deg;
                                <br />
                                <b>Lng:</b> {position.lng.toFixed(5)}&deg;
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 1, color: "primary.main", fontWeight: "bold" }}>
                                Sat: {Math.abs(satLongitude)}&deg; {satLongitude < 0 ? "West" : "East"}
                            </Typography>

                            <Typography variant="body2">
                                <b>Azimuth:</b> {Math.round(getAzimuth(position) * 100) / 100}&deg;
                                <br />
                                <b>Elevation:</b> {Math.round(getElevation(position) * 100) / 100}&deg;
                            </Typography>

                            {accuracy && (
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.secondary" }}>
                                    GPS Accuracy: ±{Math.round(accuracy)}m
                                </Typography>
                            )}
                        </div>
                    </Popup>
                </DraggableMarker>
                <Polyline pathOptions={pathOptions} positions={getPath(position)} />
            </MapContainer>
        </div>
    );
}
