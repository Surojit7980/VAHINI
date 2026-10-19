import React, { useState } from 'react';
import CommandDashboard from './CommandDashboard';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState(null);

  if (role) return <CommandDashboard role={role} onLogout={() => setRole(null)} />;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-lg border border-slate-700 shadow-2xl text-center max-w-md w-full">
        <ShieldAlert className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold tracking-widest text-white mb-2">VAHINI</h1>
        <p className="text-slate-400 mb-8 text-sm uppercase tracking-wide">Multi-Domain Tactical Simulator</p>
        
        <div className="flex flex-col gap-4">
          <button onClick={() => setRole('instructor')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-all">
            LOGIN AS INSTRUCTOR (GOD-VIEW)
          </button>
          <button onClick={() => setRole('trainee')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded transition-all">
            LOGIN AS TRAINEE (FIELD OPS)
          </button>
        </div>
      </div>
    </div>
  );
}