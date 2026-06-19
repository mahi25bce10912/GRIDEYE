import React, { useState } from 'react';
import { CORRIDORS, EVENT_TYPES, EVENT_CAUSES, ZONES } from '../data/constants';
import LocationPickerMap from './LocationPickerMap';

export default function EventForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    corridor: CORRIDORS[0],
    event_type: EVENT_TYPES[0],
    event_cause: EVENT_CAUSES[0],
    zone: ZONES[0],
    road_closure: "no",
    distance_km: 2.5,
    latitude: 12.9716,
    longitude: 77.5946,
    useCurrentTime: true,
    manualDateTime: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let targetTime = new Date();
    if (!formData.useCurrentTime && formData.manualDateTime) {
      targetTime = new Date(formData.manualDateTime);
    }

    const payload = {
      corridor: formData.corridor,
      event_type: formData.event_type,
      event_cause: formData.event_cause,
      zone: formData.zone,
      road_closure: formData.road_closure,
      distance_km: parseFloat(formData.distance_km),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      datetime: targetTime.toISOString()
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0b1329] border border-slate-800 p-6 rounded space-y-4 shadow-2xl">
      <h2 className="text-sm font-bold text-[#00f0ff] tracking-widest border-b border-slate-800 pb-2 flex justify-between items-center">
        <span>INCIDENT INGESTION ENGINE</span>
        <span className="text-xs text-slate-500 font-normal">STEP 1</span>
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-slate-400 tracking-wider mb-1">CORRIDOR</label>
          <select name="corridor" value={formData.corridor} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-sm p-2 rounded text-white focus:outline-none focus:border-[#00f0ff]">
            {CORRIDORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 tracking-wider mb-1">ZONE</label>
          <select name="zone" value={formData.zone} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-sm p-2 rounded text-white focus:outline-none focus:border-[#00f0ff]">
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-slate-400 tracking-wider mb-1">EVENT TYPE</label>
          <select name="event_type" value={formData.event_type} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-sm p-2 rounded text-white focus:outline-none focus:border-[#00f0ff]">
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 tracking-wider mb-1">EVENT CAUSE</label>
          <select name="event_cause" value={formData.event_cause} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-sm p-2 rounded text-white focus:outline-none focus:border-[#00f0ff]">
            {EVENT_CAUSES.map(ca => <option key={ca} value={ca}>{ca}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-slate-400 tracking-wider mb-1">ROAD CLOSURE</label>
          <select name="road_closure" value={formData.road_closure} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-sm p-2 rounded text-white focus:outline-none focus:border-[#00f0ff]">
            <option value="no">No Closure</option>
            <option value="yes">Requires Road Closure</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 tracking-wider mb-1">AFFECTED RADIUS (KM)</label>
          <input type="number" step="0.1" name="distance_km" value={formData.distance_km} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-sm p-2 rounded text-white focus:outline-none focus:border-[#00f0ff]" />
        </div>
      </div>

      <div className="border border-slate-800/80 p-3 rounded bg-slate-950 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[11px] text-slate-400 tracking-wider">TEMPORAL SETTINGS</label>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input type="checkbox" name="useCurrentTime" checked={formData.useCurrentTime} onChange={handleChange} className="rounded accent-[#00f0ff]" />
            Use Live Time
          </label>
        </div>
        {!formData.useCurrentTime && (
          <input type="datetime-local" name="manualDateTime" value={formData.manualDateTime} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-sm p-2 rounded text-white focus:outline-none focus:border-[#00f0ff]" required />
        )}
      </div>

      <div>
        <label className="block text-[11px] text-slate-400 tracking-wider mb-1">SELECT GPS COORDINATES ON HUD MAP</label>
        <LocationPickerMap lat={formData.latitude} lng={formData.longitude} onLocationSelect={handleLocationSelect} />
        <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
          <span>LAT: {formData.latitude.toFixed(5)}</span>
          <span>LNG: {formData.longitude.toFixed(5)}</span>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-linear-to-r from-[#00f0ff] to-[#ff007f] text-black font-black py-3 rounded text-xs tracking-widest uppercase hover:opacity-90 transition cursor-pointer disabled:opacity-50">
        {loading ? 'CALCULATING BIAS METRICS...' : 'EXECUTE PREDICTION INFERENCE'}
      </button>
    </form>
  );
}