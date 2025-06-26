import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue in Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ onLocationSelect, markerPosition }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      }
    }
  });
  return markerPosition ? (
    <Marker position={markerPosition}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
}

export default function VibesMap({ vibes, onLocationSelect, markerPosition }) {
  const [center, setCenter] = useState([28.6139, 77.2090]); // Default: Delhi

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setCenter([pos.coords.latitude, pos.coords.longitude]),
        () => {
          // fallback to first vibe with location
          const firstWithLoc = vibes && vibes.find(v => v.location && v.location.coordinates && v.location.coordinates.length === 2);
          if (firstWithLoc) setCenter([firstWithLoc.location.coordinates[1], firstWithLoc.location.coordinates[0]]);
        }
      );
    } else {
      const firstWithLoc = vibes && vibes.find(v => v.location && v.location.coordinates && v.location.coordinates.length === 2);
      if (firstWithLoc) setCenter([firstWithLoc.location.coordinates[1], firstWithLoc.location.coordinates[0]]);
    }
  }, [vibes]);

  return (
    <div style={{ width: '100%', height: 400, margin: '32px 0' }}>
      <MapContainer center={center} zoom={12} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vibes && vibes.filter(v => v.location && v.location.coordinates && v.location.coordinates.length === 2).map(vibe => (
          <Marker key={vibe._id} position={[vibe.location.coordinates[1], vibe.location.coordinates[0]]}>
            <Popup>
              <b>{vibe.title}</b><br />
              {vibe.city || ''}
            </Popup>
          </Marker>
        ))}
        {onLocationSelect && <LocationMarker onLocationSelect={onLocationSelect} markerPosition={markerPosition} />}
      </MapContainer>
    </div>
  );
} 