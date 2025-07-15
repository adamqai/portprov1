"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  vessels: any[];
}

export default function MapComponent({ vessels }: MapComponentProps) {
  const getVesselPosition = (vessel: any): [number, number] => {
    return [vessel.lat || 1.290270, vessel.lng || 103.851959];
  };

  return (
    <MapContainer center={[1.290270, 103.851959]} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {vessels?.map((vessel: any) => (
        <Marker key={vessel.id} position={getVesselPosition(vessel)}>
          <Popup>
            <strong>{vessel.vesselName}</strong><br />
            IMO: {vessel.imoNumber}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 