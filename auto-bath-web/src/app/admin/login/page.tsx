'use client'

import { useState } from 'react'
import { login } from './actions'
import { motion } from 'framer-motion'
import { Lock, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-electric-cyan/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyber-orange/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,194,212,0.1)]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-electric-cyan/10 flex items-center justify-center mb-4 border border-electric-cyan/20">
              <Lock className="w-5 h-5 text-electric-cyan" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-widest text-center">
              System Access
            </h1>
            <p className="text-white/40 text-sm mt-2 font-mono">Restricted to authorized personnel</p>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-mono uppercase tracking-widest mb-2">
                Identity
              </label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan/50 focus:ring-1 focus:ring-electric-cyan/50 transition-all font-mono text-sm"
                placeholder="admin@autobath.com.au"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-mono uppercase tracking-widest mb-2">
                Clearance Code
              </label>
              <input 
                name="password"
                type="password" 
                required
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan/50 focus:ring-1 focus:ring-electric-cyan/50 transition-all font-mono text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-mono text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#050505] font-bold uppercase tracking-widest py-3 rounded-lg mt-6 hover:bg-electric-cyan hover:shadow-[0_0_20px_rgba(0,194,212,0.4)] transition-all flex justify-center items-center h-12"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#050505]" /> : "Authenticate"}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  )
}
