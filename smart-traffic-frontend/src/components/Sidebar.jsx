// file name: src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  
  const menuItems = [
    { path: '/', label: '🎛️ CORE ENGINE', desc: 'Predictive Analytics' },
    { path: '/map', label: '🛰️ RADAR MAP', desc: 'Bengaluru Live Tracking' },
    { path: '/deployment', label: '⚡ EVENTS HAPPEND', desc: 'Resource Allocation Hub' }
  ];

  return (
    
    <div className="w-64 h-screen bg-[#010912] flex flex-col justify-between font-mono shrink-0 select-none relative border-r border-slate-900/40 rounded-tr-2xl rounded-br-2xl overflow-hidden">
    
      <style>{`
        @keyframes neonBreatheSidebar {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(0,229,255,0.2)); }
          50% { filter: drop-shadow(0 0 8px rgba(0,229,255,0.6)); }
        }
        .neon-sidebar-logo { animation: neonBreatheSidebar 3s infinite ease-in-out; }

        /* Laser Light Movement Keyframes */
        @keyframes laserHorizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes laserVertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .laser-line-top {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, #00e5ff, transparent);
          animation: laserHorizontal 3s linear infinite;
        }
        .laser-line-right {
          position: absolute;
          top: 0; right: 0; width: 2px; height: 100%;
          background: linear-gradient(180deg, transparent, #00e5ff, transparent);
          animation: laserVertical 3s linear infinite;
          animation-delay: 1.5s;
        }
        .laser-line-bottom {
          position: absolute;
          bottom: 0; left: 0; width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, #00e5ff, transparent);
          animation: laserHorizontal 3s linear infinite;
          animation-direction: reverse;
        }
        .laser-line-left {
          position: absolute;
          top: 0; left: 0; width: 2px; height: 100%;
          background: linear-gradient(180deg, transparent, #00e5ff, transparent);
          animation: laserVertical 3s linear infinite;
          animation-direction: reverse;
          animation-delay: 0.75s;
        }
      `}</style>

   
      <div className="laser-line-top" />
      <div className="laser-line-right" />
      <div className="laser-line-bottom" />
      <div className="laser-line-left" />

     
      <div className="p-6 border-b border-slate-900/60 flex items-center justify-between relative z-10">
        <div>
          <div className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 neon-sidebar-logo">
            GRIDEYE
          </div>
          <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">
            Cognitive Traffic Grid
          </div>
        </div>

       
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0 ml-2">
          <svg className="animate-spin absolute w-full h-full text-cyan-500/30" style={{ animationDuration: '6s' }} viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4, 4" />
          </svg>
          <svg className="animate-spin absolute w-6 h-6 text-cyan-400" style={{ animationDuration: '3s', animationDirection: 'reverse' }} viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8, 2" />
            <path d="M16 2 L16 6 M16 26 L16 30 M2 16 L6 16 M26 16 L30 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff] animate-pulse" />
        </div>
      </div>

    
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative z-10">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-lg transition-all border ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.15)] font-bold'
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-950 hover:text-slate-200 hover:border-slate-800'
              }`}
            >
              <div className="text-xs uppercase tracking-wider">{item.label}</div>
              <div className="text-[9px] text-slate-500 mt-0.5 font-normal lowercase italic">
                {item.desc}
              </div>
            </Link>
          );
        })}
      </div>

    
      <div className="p-4 border-t border-slate-900/60 bg-slate-950/50 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
            SECURE LINK ACTIVE
          </div>
        </div>
        <div className="text-[8px] text-slate-600 mt-0.5 uppercase">
          NODE_V4
        </div>
      </div>

    </div>
  );
}

export default Sidebar;