import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icons in React/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Your custom branding icon
const washMitraIcon = new L.Icon({
  iconUrl: '/WASH Mitra logo.png', 
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function WashMitraLeafletMap() {
  return (
    <div className="h-[500px] w-full rounded-[32px] overflow-hidden shadow-2xl border border-slate-100">
      <MapContainer 
        center={[18.5204, 73.8567]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[18.5204, 73.8567]} icon={washMitraIcon}>
          <Popup>
            <div className="text-center font-black text-[#062D27]">
              WashMitra Active Center: Pune
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}