// file name: src/pages/MapViewPage.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, Tooltip } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';

const BANGALORE_BOUNDS = [[12.7500, 77.3500], [13.1500, 77.8500]];

const getPriorityColor = (level) => {
  if (!level) return '#00e5ff'; 
  const l = level.toLowerCase();
  if (l === 'critical' || l === 'high') return '#ef4444'; 
  if (l === 'medium') return '#f59e0b'; 
  if (l === 'low') return '#10b981'; 
  return '#00e5ff';
};

function MapViewPage({ incidents, setIncidents }) {

  const clearGrid = () => {
    setIncidents([]);
  };

  const defaultCenter = incidents.length > 0 
    ? [incidents[incidents.length - 1].latitude, incidents[incidents.length - 1].longitude]
    : [12.9716, 77.5946];

  return (
    <div className="neon-glow-cyan w-full h-full min-h-137.5 rounded-xl border border-slate-800 overflow-hidden relative z-10 bg-[#010912]">
     
      <style>{`
        @keyframes neonBreatheCyan {
          0%, 100% { box-shadow: 0 0 8px rgba(0,229,255,0.15), inset 0 0 4px rgba(0,229,255,0.05); border-color: rgba(0,229,255,0.2); }
          50% { box-shadow: 0 0 20px rgba(0,229,255,0.55), inset 0 0 10px rgba(0,229,255,0.25); border-color: rgba(0,229,255,0.70); }
        }
        .neon-glow-cyan { animation: neonBreatheCyan 4s infinite ease-in-out; }
        
        /* 🚨 Leaflet's traditional white popup box overrides */
        .leaflet-tooltip {
          background: #020617 !important;
          border: 1px solid #1e293b !important;
          border-radius: 6px !important;
          padding: 0 !important;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2) !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: #020617 !important;
        }
      `}</style>
      
      <div className="absolute top-4 right-4 z-400">
        <button 
          onClick={clearGrid}
          className="bg-red-950/80 hover:bg-red-900 border border-red-700/50 text-red-400 font-mono text-[10px] px-3 py-1.5 rounded backdrop-blur-sm transition-all uppercase tracking-wider font-bold"
        >
          Wipe Radar Grid ({incidents.length})
        </button>
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={11} 
        minZoom={10} 
        maxBounds={BANGALORE_BOUNDS} 
        className="w-full h-full"
        style={{ minHeight: '550px', height: '100%' }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        
        {incidents.map((incident) => (
          <React.Fragment key={incident.id}>
            
            <Marker position={[incident.latitude, incident.longitude]}>
             
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="p-3 w-48 font-mono text-white text-[10px] space-y-1.5">
                  <div className="text-cyan-400 font-extrabold border-b border-slate-800 pb-1 uppercase tracking-widest flex justify-between items-center">
                    <span>⚠️ Anomaly Matrix</span>
                    <span style={{ color: getPriorityColor(incident.priority) }} className="text-[9px]">
                      ●
                    </span>
                  </div>
                  <div><span className="text-slate-500 font-bold">ROUTE:</span> <span className="text-slate-200">{incident.corridor || 'Dynamic Node'}</span></div>
                  <div><span className="text-slate-500 font-bold">CAUSE:</span> <span className="text-slate-200 uppercase text-[9px]">{incident.cause?.replace('_', ' ') || 'Unknown Issue'}</span></div>
                  <div><span className="text-slate-500 font-bold">THREAT LEVEL:</span> <span className="font-extrabold uppercase" style={{ color: getPriorityColor(incident.priority) }}>{incident.priority}</span></div>
                  <div><span className="text-slate-500 font-bold">AFFECTED RADIUS:</span> <span className="text-cyan-400 font-bold">{incident.radius} KM</span></div>
                </div>
              </Tooltip>
            </Marker>

            
            <Circle
              center={[incident.latitude, incident.longitude]}
              radius={parseFloat(incident.radius) * 1000} 
              pathOptions={{
                color: getPriorityColor(incident.priority),
                fillColor: getPriorityColor(incident.priority),
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 5'
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>

      <div className="absolute bottom-6 left-6 z-400 bg-slate-950/95 border border-slate-800 p-4 rounded-lg font-mono text-xs backdrop-blur-sm">
        <div className="text-cyan-400 font-bold mb-1 tracking-wider">🛰️ GRIDEYE LOCAL SITUATION MATRIX:</div>
        <div className="text-[11px] text-slate-400 tracking-wide">
          ACTIVE SPATIAL INCIDENTS LOGGED: <span className="text-white font-extrabold">{incidents.length} ZONES</span>
        </div>
      </div>
    </div>
  );
}

export default MapViewPage;