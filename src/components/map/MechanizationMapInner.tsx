'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MechanizationLog } from '@/types/schema';

// Fix leaflet default icon in Next
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MechanizationMapInner({ logs }: { logs: MechanizationLog[] }) {
  const centerLat = 9.4005;
  const centerLng = -0.9855;

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative z-10">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={9}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {logs.map((log) => (
          <div key={log.id}>
            <Marker position={[log.lat, log.lng]} icon={customIcon}>
              <Popup className="text-slate-900">
                <div className="p-1">
                  <div className="font-bold text-sm text-slate-900">{log.machineryType}</div>
                  <div className="text-xs text-slate-600">Farmer: {log.farmerName} ({log.farmCode})</div>
                  <div className="text-xs text-slate-600">Operator: {log.operatorName}</div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1">
                    Acres: {log.acresCovered} | Status: {log.status}
                  </div>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[log.lat, log.lng]}
              radius={log.acresCovered * 250}
              pathOptions={{
                color: log.status === 'Completed' ? '#10B981' : '#F59E0B',
                fillColor: log.status === 'Completed' ? '#10B981' : '#F59E0B',
                fillOpacity: 0.2,
              }}
            />
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
