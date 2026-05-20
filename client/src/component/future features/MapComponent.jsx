import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../../style/mapComponent.css';

// Fix Leaflet default marker icons (CRA doesn't resolve them automatically)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Default center (India) when no address has been geocoded yet
const DEFAULT_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;
const ADDRESS_ZOOM = 16;

// Helper component to re-center the map when coordinates change
const RecenterMap = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
};

const MapComponent = ({ coordinates, address }) => {
    const hasCoordinates = coordinates && coordinates.lat && coordinates.lng;
    const center = hasCoordinates ? [coordinates.lat, coordinates.lng] : DEFAULT_CENTER;
    const zoom = hasCoordinates ? ADDRESS_ZOOM : DEFAULT_ZOOM;

    // Build popup text from address fields
    const popupText = address
        ? [address.street, address.city, address.state, address.zipCode, address.country]
            .filter(Boolean)
            .join(', ')
        : '';

    return (
        <div className="map-container">
            <MapContainer center={center} zoom={zoom} className="map" scrollWheelZoom={true}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {hasCoordinates && (
                    <Marker position={[coordinates.lat, coordinates.lng]}>
                        <Popup>{popupText || 'Your address'}</Popup>
                    </Marker>
                )}

                <RecenterMap center={center} zoom={zoom} />
            </MapContainer>

            {!hasCoordinates && (
                <div className="map-placeholder-text">
                    <p>📍 Enter your address and click <strong>"Show on Map"</strong> to view it here</p>
                </div>
            )}
        </div>
    );
};

export default MapComponent;
