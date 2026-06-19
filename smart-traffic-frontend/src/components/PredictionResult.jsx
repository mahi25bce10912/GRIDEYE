import React from 'react';

export default function PredictionResult({ result }) {
    if (!result) {
        return (
            <div className="bg-[#0b1329] border border-slate-800 p-8 rounded h-full flex flex-col justify-center items-center text-center text-slate-500">
                <div className="text-4xl mb-2">📡</div>
                <p className="text-xs tracking-wider uppercase">Awaiting model inference matrix data</p>
            </div>
        );
    }

    const score = result.congestion_score || 0;

    let colorClass = "text-green-400";
    let borderClass = "border-green-500/30";
    if (score >= 40) { colorClass = "text-yellow-400"; borderClass = "border-yellow-500/30"; }
    if (score >= 60) { colorClass = "text-orange-400"; borderClass = "border-orange-500/30"; }
    if (score >= 80) { colorClass = "text-[#ff007f] neon-text-pink"; borderClass = "border-[#ff007f]/40"; }

    return (
        <div className="bg-[#0b1329] border border-slate-800 p-6 rounded space-y-6 shadow-2xl h-full">
            <h2 className="text-sm font-bold text-[#ff007f] tracking-widest border-b border-slate-800 pb-2 flex justify-between items-center">
                <span>MODEL INFERENCE PIPELINE OUTPUT</span>
                <span className="text-xs text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded">PASSED</span>
            </h2>

            <div className="flex flex-col items-center py-4">
                <div className="relative w-40 h-20 overflow-hidden flex flex-col justify-end items-center">
                    <div className="absolute top-0 left-0 w-40 h-40 border-12 border-slate-800 rounded-full" />
                    <div className={`absolute top-0 left-0 w-40 h-40 border-12 border-t-transparent border-l-transparent rounded-full transform rotate-45`} style={{ borderColor: score >= 60 ? '#ff007f' : '#00f0ff' }} />
                    <span className="text-4xl font-black text-white tracking-tight">{score}%</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">CONGESTION LOAD INDEX</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 border border-slate-900 rounded">
                    <div className="text-[10px] text-slate-500 tracking-wider uppercase">RISK TIER</div>
                    <div className={`text-sm font-bold ${colorClass}`}>{result.risk_level || 'N/A'}</div>
                </div>
                <div className="bg-slate-950 p-3 border border-slate-900 rounded">
                    <div className="text-[10px] text-slate-500 tracking-wider uppercase">EXPECTED DELAY</div>
                    <div className="text-sm font-bold text-white">{result.expected_delay_output || 0} MINS</div>
                </div>
                <div className="bg-slate-950 p-3 border border-slate-900 rounded">
                    <div className="text-[10px] text-slate-500 tracking-wider uppercase">TRAFFIC SPLIT INC %</div>
                    <div className="text-sm font-bold text-cyan-400">
                        {result.traffic_increase || '0%'}
                    </div>
                </div>
                <div className="bg-slate-950 p-3 border border-slate-900 rounded">
                    <div className="text-[10px] text-slate-500 tracking-wider uppercase">AFFECTED VEHICLES</div>
                    <div className="text-sm font-bold text-white">{result.affected_vehicles?.toLocaleString() || 0}</div>
                </div>
            </div>

            <div className={`border p-4 rounded bg-slate-950/80 ${borderClass}`}>
                <div className="text-[11px] text-slate-400 tracking-wider font-bold mb-2">AI RESOURCE & DEPLOYMENT MANDATES</div>
                <ul className="text-xs space-y-2 text-slate-300">
                    {result.ai_recommendations?.map((rec, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                            <span className="text-[#00f0ff]">⚡</span>
                            <span>{rec}</span>
                        </li>
                    )) || <li>No current adjustments required.</li>}
                </ul>
            </div>
        </div>
    );
}