"use client";

import { useState } from "react";
import { AlertTriangle, Bug, Zap, Activity, Database, ServerCrash } from "lucide-react";

export default function SimulatorPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  const triggerFrontendError = () => {
    addLog("Triggering unhandled frontend exception...");
    throw new Error("Sentry Test: Simulated Frontend Crash");
  };

  const triggerApiError = async () => {
    setIsLoading(true);
    addLog("Sending request to failing API endpoint...");
    try {
      const res = await fetch("/api/webhooks/stripe?simulate_error=true", { method: "POST" });
      if (!res.ok) {
        addLog(`API responded with status: ${res.status}`);
      }
    } catch (e: any) {
      addLog(`API call failed: ${e.message}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-widest flex items-center gap-3">
          <Bug className="text-cyber-orange" size={32} />
          Debug & Simulator
        </h1>
        <p className="text-white/50 mt-2 font-sans">
          Intentionally trigger edge cases, test Sentry error monitoring, and verify system resilience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentry Injection Testing */}
        <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={100} className="text-cyber-orange" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="text-cyber-orange" size={20} />
            Sentry Integrity Tests
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Force exceptions to ensure Sentry is properly capturing stack traces, user contexts, and environments.
          </p>
          <div className="space-y-4">
            <button 
              onClick={triggerFrontendError}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#df1b41]/10 text-[#df1b41] border border-[#df1b41]/20 rounded-xl hover:bg-[#df1b41]/20 transition-all"
            >
              <span className="font-bold text-sm">Force Client-Side Crash</span>
              <ServerCrash size={16} />
            </button>
            <button 
              onClick={triggerApiError}
              disabled={isLoading}
              className="w-full flex items-center justify-between px-4 py-3 bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20 rounded-xl hover:bg-electric-cyan/20 transition-all disabled:opacity-50"
            >
              <span className="font-bold text-sm">Simulate Webhook Failure</span>
              <Database size={16} />
            </button>
          </div>
        </div>

        {/* Future Simulators */}
        <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 relative overflow-hidden group opacity-50">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={100} className="text-electric-cyan" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-electric-cyan" size={20} />
            Load & Yield Simulator (Coming Soon)
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Test the dynamic surge pricing engine by simulating high calendar load.
          </p>
          <button disabled className="w-full px-4 py-3 bg-white/5 text-white/30 border border-white/5 rounded-xl cursor-not-allowed">
            Simulate 90% Calendar Capacity
          </button>
        </div>
      </div>

      {/* Simulator Logs */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Event Logs</h3>
        <div className="h-64 overflow-y-auto font-mono text-xs text-electric-cyan/70 space-y-2 p-4 bg-black rounded-lg border border-white/5">
          {logs.length === 0 ? (
            <p className="text-white/20">System ready. Waiting for events...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="border-l-2 border-electric-cyan/30 pl-3 py-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
