import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CongestionChart({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-[#0b1329] border border-slate-800 p-6 rounded h-48 flex items-center justify-center text-slate-500 text-xs">
        EXECUTE RUNTIME RUN TO POPULATE TREND LABELS
      </div>
    );
  }

  return (
    <div className="bg-[#0b1329] border border-slate-800 p-5 rounded space-y-3 shadow-2xl">
      <h3 className="text-xs font-bold text-[#00f0ff] tracking-widest uppercase">24-HOUR CIRCADIAN IMPACT PROFILE</h3>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" h="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff007f" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff007f" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 9 }} />
            <YAxis stroke="#4b5563" tick={{ fontSize: 9 }} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#030712', borderColor: '#1f2937', color: '#fff', fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10, pt: 10 }} />
            <Area type="monotone" dataKey="normal_flow" name="Baseline Flow" stroke="#00f0ff" fillOpacity={1} fill="url(#colorNormal)" strokeWidth={1.5} />
            <Area type="monotone" dataKey="predicted_flow" name="Post-Incident Flow" stroke="#ff007f" fillOpacity={1} fill="url(#colorPred)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}