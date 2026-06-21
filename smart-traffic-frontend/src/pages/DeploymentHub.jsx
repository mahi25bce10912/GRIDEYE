import React, { useState, useEffect } from 'react';

function DeploymentHub() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadLogs = () => {
      const data = window.hub_events_list || [];
      setEvents([...data]);
    };

    loadLogs();
    const interval = setInterval(loadLogs, 1000); 
    return () => clearInterval(interval);
  }, []);

  const mainCorridors = [
    'Outer Ring Road', 
    'Tumkur Road', 
    'Hosur Road', 
    'Bellary Road', 
    'Old Madras Road',
    'Mysore Road',
    'Bannerghatta Road'
  ];

  const corridorCounts = {};
  mainCorridors.forEach(corridor => {
    corridorCounts[corridor] = 0; 
  });

  events.forEach(ev => {
    if (!ev.corridor) return;
  
    if (
      ev.corridor.includes("ORR") ||
      ev.corridor.includes("Outer Ring")
    ) {
      corridorCounts["Outer Ring Road"] += 1;
    }
    else if (ev.corridor.includes("Tumkur")) {
      corridorCounts["Tumkur Road"] += 1;
    }
    else if (ev.corridor.includes("Hosur")) {
      corridorCounts["Hosur Road"] += 1;
    }
    else if (ev.corridor.includes("Bellary")) {
      corridorCounts["Bellary Road"] += 1;
    }
    else if (ev.corridor.includes("Old Madras")) {
      corridorCounts["Old Madras Road"] += 1;
    }
    else if (ev.corridor.includes("Mysore")) {
      corridorCounts["Mysore Road"] += 1;
    }
    else if (ev.corridor.includes("Bannerghata")) {
      corridorCounts["Bannerghatta Road"] += 1;
    }
  });

  const maxAccidents = Math.max(...Object.values(corridorCounts), 1);
  const neonBarStyles = [
    { bg: 'bg-[#00e5ff]', shadow: 'shadow-[0_0_12px_rgba(0,229,255,0.7)]', text: 'text-[#00e5ff]' }, // Neon Cyan
    { bg: 'bg-[#ff0055]', shadow: 'shadow-[0_0_12px_rgba(255,0,85,0.7)]', text: 'text-[#ff0055]' }, // Neon Magenta
    { bg: 'bg-[#a855f7]', shadow: 'shadow-[0_0_12px_rgba(168,85,247,0.7)]', text: 'text-[#a855f7]' }, // Neon Purple
    { bg: 'bg-[#10b981]', shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.7)]', text: 'text-[#10b981]' }, // Neon Green
    { bg: 'bg-[#f59e0b]', shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.7)]', text: 'text-[#f59e0b]' }, // Neon Amber
    { bg: 'bg-[#ec4899]', shadow: 'shadow-[0_0_12px_rgba(236,72,153,0.7)]', text: 'text-[#ec4899]' }, // Neon Pink
    { bg: 'bg-[#3b82f6]', shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.7)]', text: 'text-[#3b82f6]' }, // Neon Blue
  ];

  return (
    <div className="space-y-6 font-mono text-white h-full">
      <style>{`
        @keyframes neonBreatheCyan {
          0%, 100% { box-shadow: 0 0 8px rgba(0,229,255,0.2), inset 0 0 4px rgba(0,229,255,0.1); border-color: rgba(0,229,255,0.3); }
          50% { box-shadow: 0 0 18px rgba(0,229,255,0.6), inset 0 0 8px rgba(0,229,255,0.3); border-color: rgba(0,229,255,0.8); }
        }
        @keyframes neonBreatheMagenta {
          0%, 100% { box-shadow: 0 0 8px rgba(255,0,85,0.2), inset 0 0 4px rgba(255,0,85,0.1); border-color: rgba(255,0,85,0.3); }
          50% { box-shadow: 0 0 18px rgba(255,0,85,0.6), inset 0 0 8px rgba(255,0,85,0.3); border-color: rgba(255,0,85,0.8); }
        }
        .neon-glow-cyan { animation: neonBreatheCyan 4s infinite ease-in-out; }
        .neon-glow-magenta { animation: neonBreatheMagenta 4s infinite ease-in-out; }
      `}</style>

      <div className="w-full bg-[#010912] border border-slate-800 p-4 rounded-xl text-center text-xs tracking-widest text-slate-400">
        Status: Operating Grid Matrix Secure // Broadcast Live
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1.4fr] gap-6">
        <div className="neon-glow-cyan border rounded-2xl bg-[#010912] p-6 h-125 flex flex-col">
          <h2 className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-900 pb-2">
            📋 Live Synchronized Event Logs ({events.length})
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {events.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs text-center space-y-2">
                <span className="text-xl">⚡</span>
                <p className="uppercase tracking-wider text-[10px]">Grid Vacant. Go to engine and trigger items.</p>
              </div>
            ) : (
              [...events].reverse().map((ev) => (
                <div key={ev.id} className="bg-slate-950/90 border border-slate-900 rounded-lg p-4 flex justify-between items-center hover:border-cyan-500/40 transition-all">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white uppercase tracking-wide">{ev.name}</div>
                    <div className="text-[10px] text-slate-500 flex gap-4">
                      <span>📍 {ev.location}</span>
                      <span className="text-cyan-400 font-semibold">Core: {ev.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] bg-red-950/60 text-red-400 border border-red-900 px-2 py-0.5 rounded uppercase font-bold shadow-[0_0_5px_#ff0055]">
                      {ev.cause ? ev.cause.replace('_', ' ') : 'unplanned'}
                    </span>
                    <div className="text-[9px] text-slate-600 mt-1">{ev.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="neon-glow-magenta border rounded-2xl bg-[#010912] p-6 h-125 flex flex-col justify-between">
          <div className="border-b border-slate-900 pb-2 mb-2">
            <h2 className="text-magenta-400 font-bold text-xs uppercase tracking-wider">
              📈 Incident Density Matrix (By Area / Road Code)
            </h2>
            <p className="text-[9px] text-slate-500 mt-0.5">Live distribution of predicted anomalies across major economic corridors</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-around py-2 space-y-1">
            {mainCorridors.map((corridor, index) => {
              const count = corridorCounts[corridor] || 0;
              const percentageWidth = (count / maxAccidents) * 100;
              const styleObj = neonBarStyles[index % neonBarStyles.length];

              return (
                <div key={corridor} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold tracking-wide uppercase">
                    <span className="text-slate-300">{corridor}</span>
                    <span className={`${styleObj.text} font-mono text-[9px]`}>{count} INCIDENTS</span>
                  </div>

                  <div className="w-full h-3 bg-slate-950/80 rounded border border-slate-900 overflow-hidden relative flex items-center">
                    <div 
                      className={`h-full transition-all duration-700 ease-out ${styleObj.bg} ${styleObj.shadow}`}
                      style={{ width: `${count === 0 ? '1.5%' : `${percentageWidth}%`}` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[8px] text-slate-600 text-center tracking-widest pt-2 border-t border-slate-900 mt-2">
            GRIDEYE ANALYTICS MATRIX // LIVE CORRIDOR TELEMETRY STREAMING
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeploymentHub;
