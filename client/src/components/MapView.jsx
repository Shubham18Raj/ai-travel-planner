import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapView({ source, destination, sourceCoords, destCoords }) {
  if (!sourceCoords || !destCoords) {
    return (
      <div className="h-[400px] glass-card flex items-center justify-center">
        <p className="text-surface-400">Map coordinates not available</p>
      </div>
    );
  }

  const center = [
    (sourceCoords.lat + destCoords.lat) / 2,
    (sourceCoords.lng + destCoords.lng) / 2,
  ];

  return (
    <div className="h-[400px] rounded-2xl overflow-hidden border border-white/10">
      <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[sourceCoords.lat, sourceCoords.lng]}>
          <Popup><strong>{source}</strong><br />Starting point</Popup>
        </Marker>
        <Marker position={[destCoords.lat, destCoords.lng]}>
          <Popup><strong>{destination}</strong><br />Destination</Popup>
        </Marker>
        <Polyline
          positions={[[sourceCoords.lat, sourceCoords.lng], [destCoords.lat, destCoords.lng]]}
          color="#338dff" weight={3} dashArray="10, 10" opacity={0.7}
        />
      </MapContainer>
    </div>
  );
}
