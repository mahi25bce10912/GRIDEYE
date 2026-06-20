import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamic production backend URL linking directly to Railway with secure wildcard origins
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grideye-production-a323.up.railway.app';
const BANGALORE_BOUNDS = [[12.7500, 77.3500], [13.1500, 77.8500]];

const getPriorityColor = (level) => {
  if (!level) return '#00e5ff'; 
  const l = level.toLowerCase();
  if (l === 'critical' || l === 'high') return '#ef4444'; 
  if (l === 'medium') return '#f59e0b'; 
  if (l === 'low') return '#10b981'; 
  return '#00e5ff';
};

function MapViewUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1] && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

function LocationMarker({ setFormData }) {
  useMapEvents({
    click(e) {
      setFormData(prev => ({
        ...prev,
        latitude: parseFloat(e.latlng.lat.toFixed(6)),
        longitude: parseFloat(e.latlng.lng.toFixed(6))
      }));
    }
  });
  return null;
}

function HomePage({ setIncidents }) {
  const [formData, setFormData] = useState({
    event_type: 'unplanned',
    event_cause: 'vehicle_breakdown',
    latitude: 12.9716,
    longitude: 77.5946,
    corridor: 'Tumkur Road', 
    zone: 'Central Zone 1'   
  });

  const [timeOption, setTimeOption] = useState('current'); 
  const [manualDateTime, setManualDateTime] = useState(''); 

  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  const latVal = parseFloat(formData.latitude) || 12.9716;
  const lngVal = parseFloat(formData.longitude) || 77.5946;

  const eventCauses = [
    { value: 'vehicle_breakdown', label: 'Vehicle Breakdown' },
    { value: 'pot_holes', label: 'Pot Holes / Ruts' },
    { value: 'water_logging', label: 'Water Logging' },
    { value: 'accident', label: 'Traffic Accident' },
    { value: 'congestion', label: 'Traffic Congestion' },
    { value: 'construction', label: 'Road Construction' },
    { value: 'road_conditions', label: 'Bad Road Conditions' },
    { value: 'vip_movement', label: 'VIP Movement' },
    { value: 'procession', label: 'Procession' },
    { value: 'protest', label: 'Protest / Demonstration' },
    { value: 'tree_fall', label: 'Tree Fall' },
    { value: 'public_event', label: 'Public Event' },
    { value: 'Debris', label: 'Debris (Capital)' },
    { value: 'debris', label: 'Debris (Lowercase)' },
    { value: 'Fog / Low Visibility', label: 'Fog / Low Visibility' },
    { value: 'test_demo', label: 'Test Demo' },
    { value: 'others', label: 'Others / Unclassified' }
  ];

  const datasetZones = [
    { value: 'Central Zone 1', label: 'Central Zone 1' },
    { value: 'Central Zone 2', label: 'Central Zone 2' },
    { value: 'East Zone 1', label: 'East Zone 1' },
    { value: 'East Zone 2', label: 'East Zone 2' },
    { value: 'North Zone 1', label: 'North Zone 1' },
    { value: 'North Zone 2', label: 'North Zone 2' },
    { value: 'South Zone 1', label: 'South Zone 1' },
    { value: 'South Zone 2', label: 'South Zone 2' },
    { value: 'West Zone 1', label: 'West Zone 1' },
    { value: 'West Zone 2', label: 'West Zone 2' }
  ];

  const datasetCorridors = [
    { value: 'Tumkur Road', label: 'Tumkur Road (NH-4)' },
    { value: 'ORR East 1', label: 'Outer Ring Road (ORR) East 1' },
    { value: 'ORR East 2', label: 'Outer Ring Road (ORR) East 2' },
    { value: 'ORR West 1', label: 'Outer Ring Road (ORR) West 1' },
    { value: 'ORR North 1', label: 'Outer Ring Road (ORR) North 1' },
    { value: 'ORR North 2', label: 'Outer Ring Road (ORR) North 2' },
    { value: 'Old Madras Road', label: 'Old Madras Road (OMR)' },
    { value: 'Bellary Road 1', label: 'Bellary Road 1 (Airport Hwy)' },
    { value: 'Bellary Road 2', label: 'Bellary Road 2 (Airport Hwy)' },
    { value: 'Hosur Road', label: 'Hosur Road Expressway' },
    { value: 'Bannerghata Road', label: 'Bannerghatta Road' },
    { value: 'Magadi Road', label: 'Magadi Road' },
    { value: 'IRR(Thanisandra road)', label: 'Inner Ring Road (Thanisandra)' },
    { value: 'Mysore Road', label: 'Mysore Road' },
    { value: 'West of Chord Road', label: 'West of Chord Road' },
    { value: 'CBD 1', label: 'Central Business District 1' },
    { value: 'CBD 2', label: 'Central Business District 2' },
    { value: 'Old Airport Road', label: 'Old Airport Road' },
    { value: 'Hennur Main Road', label: 'Hennur Main Road' },
    { value: 'Airport New South Road', label: 'Airport New South Road' },
    { value: 'Varthur Road', label: 'Varthur Road' },
    { value: 'Non-corridor', label: 'Non-Corridor Grid' }
  ];

  const handleCoordChange = (field, val) => {
    if (val === '') {
      setFormData(prev => ({ ...prev, [field]: '' }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setNetworkError(null);
    
    const parsedLat = parseFloat(formData.latitude) || 12.9716;
    const parsedLng = parseFloat(formData.longitude) || 77.5946;

    let payload = { 
      ...formData,
      latitude: parsedLat,
      longitude: parsedLng
    };
    let loggingTimeStr = "";

    if (timeOption === 'current') {
      payload.datetime = new Date().toISOString();
      loggingTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      if (!manualDateTime) {
        setNetworkError("TEMPORAL ERROR: Please select a valid manual date/time matrix before execution.");
        setIsProcessing(false);
        return;
      }
      payload.datetime = manualDateTime;
      const customDate = new Date(manualDateTime);
      loggingTimeStr = isNaN(customDate.getTime()) 
        ? "Manual Setup" 
        : customDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    try {
      // Connecting securely with Railway API domain parameters
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Inference Core responded with status ${response.status}`);
      }
      
      const data = await response.json();
      if (data.status === 'success') {
        const calculatedRisk = data.risk_level || 'Medium';
        const calculatedRadius = data.predictions?.affected_radius_km || data.predictions?.radius || 1.5;

        const newIncident = {
          id: Date.now(),
          latitude: parsedLat,
          longitude: parsedLng,
          radius: calculatedRadius,
          priority: calculatedRisk,
          corridor: formData.corridor, 
          cause: formData.event_cause   
        };
        if (setIncidents && typeof setIncidents === 'function') {
          setIncidents(prev => [...prev, newIncident]);
        }

        if (!window.hub_events_list) {
          window.hub_events_list = [];
        }
        
        const newLog = {
          id: Date.now(),
          name: `${formData.corridor} Anomaly`,
          location: `${parsedLat}, ${parsedLng}`,
          type: formData.event_type,
          cause: formData.event_cause,
          time: loggingTimeStr 
        };
        
        window.hub_events_list.push(newLog);
        
        setResult({
          ...data.predictions,
          risk_level: calculatedRisk,
          congestion_score: data.congestion_score || 50,
          expected_delay_output: data.predictions?.expected_delay_output || data.predictions?.expected_delay || 0,
          road_closure_probability: data.predictions?.road_closure_probability || '0%',
          should_close_road: data.predictions?.should_close_road || 'NO',
          affected_radius_km: calculatedRadius,
          police_officers_required: data.predictions?.police_officers_required || data.predictions?.officers || 0,
          barricades_required: data.predictions?.barricades_required || data.predictions?.barricades || 0,
          expected_duration_hours: data.predictions?.expected_duration_hours || data.predictions?.duration || 0
        });
      }
    } catch (err) {
      console.error("Inference Engine Connection Failed:", err);
      setNetworkError(`ASTRAM CORE OFFLINE: Production inference server at ${API_BASE_URL} is unreachable.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 font-mono text-white">
      <style>{`
        @keyframes neonBreatheCyan {
          0%, 100% { box-shadow: 0 0 8px rgba(0,229,255,0.15), inset 0 0 4px rgba(0,229,255,0.05); border-color: rgba(0,229,255,0.2); }
          50% { box-shadow: 0 0 16px rgba(0,229,255,0.5), inset 0 0 8px rgba(0,229,255,0.25); border-color: rgba(0,229,255,0.7); }
        }
        @keyframes neonBreatheMagenta {
          0%, 100% { box-shadow: 0 0 8px rgba(255,0,85,0.15), inset 0 0 4px rgba(255,0,85,0.05); border-color: rgba(255,0,85,0.2); }
          50% { box-shadow: 0 0 16px rgba(255,0,85,0.5), inset 0 0 8px rgba(255,0,85,0.25); border-color: rgba(255,0,85,0.7); }
        }
        .neon-glow-cyan { animation: neonBreatheCyan 4s infinite ease-in-out; }
        .neon-glow-magenta { animation: neonBreatheMagenta 4s infinite ease-in-out; }
      `}</style>

      <div>
        <h1 className="text-2xl font-bold text-cyan-400 tracking-wider">GRIDEYE COGNITIVE INFERENCE MATRIX</h1>
        <p className="text-xs text-slate-500">Real-time multi-variable anomaly routing & hazard mitigation hub</p>
      </div>

      {networkError && (
        <div className="bg-red-950/80 border border-red-700/60 p-4 rounded-xl text-red-400 text-xs shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse flex flex-col gap-1.5">
          <span className="font-extrabold tracking-widest text-[11px] text-red-200">⚠️ CRITICAL EXCEPTION IN INFRASTRUCTURE TUNNEL:</span>
          <span>{networkError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="neon-glow-cyan border rounded-xl p-px bg-slate-950">
          <form onSubmit={handleSubmit} className="p-6 h-full space-y-5 bg-[#010912] rounded-xl border border-transparent hover:border-slate-800/60 transition-all">
            <div>
              <label className="block text-[10px] text-cyan-400 mb-2 uppercase font-bold tracking-widest">
                🛰️ Select Spatial Grid Coordinates:
              </label>
              <div className="w-full h-56 rounded border border-slate-900 overflow-hidden relative z-20">
                <MapContainer center={[latVal, lngVal]} zoom={11} minZoom={10} maxBounds={BANGALORE_BOUNDS} className="w-full h-full">
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <Marker position={[latVal, lngVal]} />
                  
                  {result && (result.affected_radius_km > 0) && (
                    <Circle
                      center={[latVal, lngVal]}
                      radius={parseFloat(result.affected_radius_km) * 1000}
                      pathOptions={{
                        color: getPriorityColor(result.risk_level),
                        fillColor: getPriorityColor(result.risk_level),
                        fillOpacity: 0.15,
                        weight: 2
                      }}
                    />
                  )}

                  <MapViewUpdater center={[latVal, lngVal]} />
                  <LocationMarker setFormData={setFormData} />
                </MapContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3 bg-slate-950/80 p-3 border border-slate-900 rounded">
                <div>
                  <label className="block text-[9px] text-slate-500 mb-0.5 font-bold">LATITUDE</label>
                  <input 
                    type="number" 
                    step="0.000001" 
                    value={formData.latitude} 
                    onChange={(e) => handleCoordChange('latitude', e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded p-1 text-xs text-emerald-400 font-bold focus:outline-none transition-colors" 
                    placeholder="e.g. 12.9716"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 mb-0.5 font-bold">LONGITUDE</label>
                  <input 
                    type="number" 
                    step="0.000001" 
                    value={formData.longitude} 
                    onChange={(e) => handleCoordChange('longitude', e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded p-1 text-xs text-emerald-400 font-bold focus:outline-none transition-colors" 
                    placeholder="e.g. 77.5946"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase">Target Corridor</label>
                <select value={formData.corridor} onChange={(e) => setFormData({...formData, corridor: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer">
                  {datasetCorridors.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase">Jurisdiction Zone</label>
                <select value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer">
                  {datasetZones.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase">Event Nature</label>
                <select value={formData.event_type} onChange={(e) => setFormData({...formData, event_type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer">
                  <option value="unplanned">Unplanned</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase">Core Cause</label>
                <select value={formData.event_cause} onChange={(e) => setFormData({...formData, event_cause: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer">
                  {eventCauses.map(cause => <option key={cause.value} value={cause.value}>{cause.label}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-900/80 p-4 rounded space-y-3">
              <label className="block text-[10px] text-cyan-400 uppercase font-bold tracking-widest">
                ⏳ Temporal Matrix Selection:
              </label>
              
              <div className="flex gap-6 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white transition-all">
                  <input 
                    type="radio" 
                    name="timeOption" 
                    value="current" 
                    checked={timeOption === 'current'} 
                    onChange={() => setTimeOption('current')} 
                    className="accent-cyan-400 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Current Time (Live)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white transition-all">
                  <input 
                    type="radio" 
                    name="timeOption" 
                    value="manual" 
                    checked={timeOption === 'manual'} 
                    onChange={() => setTimeOption('manual')} 
                    className="accent-cyan-400 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Manual Matrix Entry</span>
                </label>
              </div>

              {timeOption === 'manual' && (
                <div className="mt-2 pt-1">
                  <input
                    type="datetime-local"
                    value={manualDateTime}
                    onChange={(e) => setManualDateTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 scheme-dark"
                    required={timeOption === 'manual'}
                  />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full text-black font-extrabold py-3 px-4 rounded text-xs transition-all tracking-widest uppercase cursor-pointer border-none ${
                isProcessing 
                  ? 'bg-slate-700 text-slate-400 animate-pulse' 
                  : 'bg-linear-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:scale-[1.01] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
              }`}
            >
              {isProcessing ? '⚡ EXECUTING INFERENCE CORE...' : 'EXECUTE INFERENCE ENGINE'}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div className="neon-glow-cyan border rounded-xl p-px bg-slate-950">
            <div className="p-5 flex flex-col justify-between bg-[#010912] rounded-xl space-y-4">
              {result ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <h2 className="text-xs text-cyan-400 tracking-widest uppercase font-bold">Predictive Analytics</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      result.risk_level === 'Critical' || result.risk_level === 'High' ? 'bg-red-950 text-red-400 border-red-900 animate-pulse' : 'bg-amber-950 text-amber-400 border-amber-900'
                    }`}>
                      PRIORITY: {result.risk_level.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                      <div className="text-[9px] text-slate-500 mb-0.5">SYSTEM DELAY</div>
                      <div className="text-sm font-bold text-white">{result.expected_delay_output} MINS</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                      <div className="text-[9px] text-slate-500 mb-0.5">ROAD CLOSURE RATIO</div>
                      <div className="text-sm font-bold text-red-400">{result.road_closure_probability}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                      <div className="text-[9px] text-slate-500 mb-0.5">FORCE ROAD BLOCKS?</div>
                      <div className="text-sm font-bold text-amber-500">{result.should_close_road}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                      <div className="text-[9px] text-slate-500 mb-0.5">AFFECTED RADIAL MATRIX</div>
                      <div className="text-sm font-bold text-cyan-400">{result.affected_radius_km} KM</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-900 text-center">
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-900/60">
                      <div className="text-[8px] text-slate-500 mb-0.5">OFFICERS</div>
                      <div className="text-sm font-bold text-emerald-400">{result.police_officers_required}</div>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-900/60">
                      <div className="text-[8px] text-slate-500 mb-0.5">BARRICADES</div>
                      <div className="text-sm font-bold text-purple-400">{result.barricades_required}</div>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-900/60">
                      <div className="text-[8px] text-slate-500 mb-0.5">EST DURATION</div>
                      <div className="text-sm font-bold text-cyan-400">{result.expected_duration_hours} HRS</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-600 text-center py-6 text-xs tracking-widest uppercase animate-pulse">
                  📡 Awaiting Real-Time Geospatial Engine Triggers...
                </div>
              )}
            </div>
          </div>

          {result && (
            <div className="flex flex-col gap-6 w-full">
              <div className="neon-glow-cyan border rounded-xl p-px bg-slate-950 w-full">
                <div className="bg-[#010912] p-4 rounded-xl space-y-3">
                  <span className="text-[9px] text-cyan-400 block tracking-widest uppercase font-bold">📈 Congestion Velocity</span>
                  <div className="h-24 w-full bg-slate-950/80 rounded border border-slate-900 relative p-1 flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path d="M 0 35 Q 25 15, 50 25 T 100 30" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2" />
                      <path d={`M 0 35 Q 25 ${35 - (result.congestion_score * 0.2)}, 50 ${35 - (result.congestion_score * 0.35)} T 100 22`} fill="none" stroke="#00e5ff" strokeWidth="2" className="drop-shadow-[0_0_6px_#00e5ff]" />
                    </svg>
                    <div className="absolute top-1.5 right-2 text-[8px] text-cyan-400 font-bold bg-slate-950/90 px-1 border border-slate-900 rounded">SPIKE: {result.congestion_score}</div>
                  </div>
                  <div className="flex justify-between text-[7px] text-slate-600 px-0.5 font-bold">
                    <span>MIN CYCLE</span>
                    <span>CURRENT FLOW</span>
                    <span>MAX INTERVAL</span>
                  </div>
                </div>
              </div>

              <div className="neon-glow-magenta border rounded-xl p-px bg-slate-950 w-full">
                <div className="bg-[#010912] p-4 rounded-xl space-y-3">
                  <span className="text-[9px] text-pink-500 block tracking-widest uppercase font-bold">📊 Asset Allocation Load</span>
                  <div className="h-24 bg-slate-950/80 rounded border border-slate-900 p-2.5 flex flex-col justify-around">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                        <span>FORCE DISPATCH</span>
                        <span className="text-emerald-400">{result.police_officers_required} UNITS</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 shadow-[0_0_6px_#34d399]" style={{ width: `${Math.min(result.police_officers_required * 6, 100)}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                        <span>BARRICADE BLOCKADE</span>
                        <span className="text-purple-400">{result.barricades_required} UNITS</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 shadow-[0_0_6px_#c084fc]" style={{ width: `${Math.min(result.barricades_required * 3, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
