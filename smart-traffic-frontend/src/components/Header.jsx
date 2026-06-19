// file name: src/components/Header.jsx
import React from 'react';

function Header() {
  return (
    <header className="animate-neon-border p-0.5 mb-8 w-full block">
      <div className="bg-[#020617] px-6 py-4 rounded-xl flex items-center justify-between font-mono">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <span className="text-xs text-slate-500 block tracking-widest">NEURAL INFERENCE NODE</span>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-orange-400 tracking-wider">
              GRIDEYE REAL-TIME COMMAND HUB
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2 rounded flex items-center gap-2">
            <span className="text-slate-500">BENGALURU GRID:</span>
            <span className="text-emerald-400 font-bold tracking-wider animate-pulse">ACTIVE // 100%</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2 rounded flex items-center gap-2">
            <span className="text-slate-500">CATBOOST CORE: </span>
            <span className="text-cyan-400 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;