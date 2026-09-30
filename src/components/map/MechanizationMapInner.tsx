'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { MechanizationLog, FarmAsset } from '@/types/schema';

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

export default function MechanizationMapInner({
  logs,
  farms = [],
}: {
  logs: MechanizationLog[];
  farms?: FarmAsset[];
}) {
  const centerLat = 9.4005;
  const centerLng = -0.9855;

  return (
    <div className="w-full h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative z-10">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={8}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Digitized GeoJSON Farm Boundary Polygons */}
        {farms.map((farm) => {
          if (farm.polygonCoordinates && farm.polygonCoordinates.length > 2) {
            const hasActiveLog = logs.some((l) => l.farmCode === farm.farmCode && l.status === 'In Progress');
            const hasCompletedLog = logs.some((l) => l.farmCode === farm.farmCode && l.status === 'Completed');

            const polygonColor = hasActiveLog ? '#F59E0B' : hasCompletedLog ? '#10B981' : '#6366F1';

            return (
              <Polygon
                key={farm.id}
                positions={farm.polygonCoordinates}
                pathOptions={{
                  color: polygonColor,
                  fillColor: polygonColor,
                  fillOpacity: 0.35,
                  weight: 2,
                }}
              >
                <Popup className="text-slate-900">
                  <div className="p-1">
                    <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{farm.farmCode}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono">
                        GeoJSON Mapped
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 mt-1">
                      <strong>Owner:</strong> {farm.farmerName}
                    </div>
                    <div className="text-xs text-slate-700">
                      <strong>Crop & Acreage:</strong> {farm.crop} • {farm.acreage} Acres
                    </div>
                    <div className="text-xs text-slate-700">
                      <strong>Soil & Tenure:</strong> {farm.soilType} • {farm.tenureAgreement}
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 mt-1.5">
                      {hasActiveLog ? '🚜 Active Machinery On-Site' : hasCompletedLog ? '✅ Mechanization Complete' : '🌾 Farm Polygon Ready for Dispatch'}
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* Render Active Machinery Telematics Markers & Coverage Radii */}
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
                fillOpacity: 0.15,
                weight: 1.5,
              }}
            />
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
