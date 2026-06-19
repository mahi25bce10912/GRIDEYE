import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { BANGALORE_CENTER, MAP_BOUNDS } from '../data/constants';

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({ lat, lng, onLocationSelect }) {
  return (
    <div className="w-full h-64 bg-slate-900 rounded border border-slate-800 overflow-hidden relative">
      <div className="absolute top-2 right-2 z-1000 bg-black/80 px-2 py-1 text-[10px] text-[#00f0ff] border border-[#00f0ff]/30 rounded">
        MAP PICKER MODE
      </div>
      <MapContainer
        center={BANGALORE_CENTER}
        zoom={11}
        maxBounds={MAP_BOUNDS}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {lat && lng && <Marker position={[lat, lng]} />}
      </MapContainer>
    </div>
  );
}