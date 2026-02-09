'use client';

import { LayoutDashboard, Activity, Zap } from 'lucide-react';

export default function CockpitPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          COCKPIT
        </h1>
        <p className="mt-2 text-gray-400">
          Visão estratégica consolidada do negócio
        </p>
      </div>

      {/* Grid de Painéis */}
      <div className="grid gap-6 md:grid-cols-3">
        <a href="/admin/cockpit/consolidado" className="group rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6 hover:border-[#D4AF37]/50 transition-all">
          <LayoutDashboard className="h-12 w-12 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold text-white mb-2">Consolidado</h3>
          <p className="text-sm text-gray-400">Visão geral de todas as operações</p>
        </a>

        <a href="/admin/cockpit/consolidado" className="group rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6 hover:border-[#D4AF37]/50 transition-all">
          <Activity className="h-12 w-12 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold text-white mb-2">Performance</h3>
          <p className="text-sm text-gray-400">Métricas de performance em tempo real</p>
        </a>

        <a href="/admin/cockpit/connect" className="group rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6 hover:border-[#D4AF37]/50 transition-all">
          <Zap className="h-12 w-12 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold text-white mb-2">Connect</h3>
          <p className="text-sm text-gray-400">Integrações e conexões ativas</p>
        </a>
      </div>
    </div>
  );
}
