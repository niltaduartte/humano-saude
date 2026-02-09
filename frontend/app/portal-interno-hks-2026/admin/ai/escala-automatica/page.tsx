'use client';

import { Zap, TrendingUp, DollarSign, Target } from 'lucide-react';

export default function EscalaAutomaticaPage() {
  const campaigns = [
    { name: 'Plano Família Unimed', budget: 5000, leads: 187, cpl: 26.74, roi: 342, status: 'scaling', action: '+20% budget' },
    { name: 'Empresarial Bradesco', budget: 8000, leads: 234, cpl: 34.19, roi: 298, status: 'optimizing', action: 'Manter' },
    { name: 'Individual Amil', budget: 3500, leads: 95, cpl: 36.84, roi: 187, status: 'pausing', action: '-50% budget' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          ESCALA AUTOMÁTICA
        </h1>
        <p className="mt-2 text-gray-400">Sistema de auto-scaling inteligente baseado em performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { icon: Zap, label: 'Campanhas Auto', value: '12', color: 'text-[#D4AF37]' },
          { icon: TrendingUp, label: 'Budget Otimizado', value: 'R$ 18.7K', color: 'text-green-500' },
          { icon: DollarSign, label: 'Economia IA', value: 'R$ 4.2K', color: 'text-blue-500' },
          { icon: Target, label: 'ROI Médio', value: '342%', color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <stat.icon className={`h-8 w-8 ${stat.color} mb-4`} />
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Campanhas com Auto-Scaling</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm text-gray-400">Auto-Scaling Global</span>
            <div className="relative inline-block w-12 h-6 bg-green-500/20 rounded-full">
              <div className="absolute left-1 top-1 w-4 h-4 bg-green-500 rounded-full transition-transform translate-x-6"></div>
            </div>
          </label>
        </div>

        <div className="divide-y divide-[#D4AF37]/10">
          {campaigns.map((camp, i) => (
            <div key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">{camp.name}</h4>
                  <div className="flex gap-6 text-sm">
                    <span className="text-gray-400">Budget: <strong className="text-white">R$ {camp.budget.toLocaleString('pt-BR')}</strong></span>
                    <span className="text-gray-400">Leads: <strong className="text-[#D4AF37]">{camp.leads}</strong></span>
                    <span className="text-gray-400">CPL: <strong className="text-white">R$ {camp.cpl.toFixed(2)}</strong></span>
                    <span className="text-gray-400">ROI: <strong className="text-green-500">{camp.roi}%</strong></span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  camp.status === 'scaling' ? 'bg-green-500/20 text-green-500' :
                  camp.status === 'optimizing' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {camp.status === 'scaling' ? '🚀 Escalando' : camp.status === 'optimizing' ? '⚡ Otimizando' : '⏸️ Pausando'}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[#151515] border border-[#D4AF37]/10">
                <p className="text-sm text-gray-300 mb-2">
                  <strong className="text-[#D4AF37]">Ação da IA:</strong> {camp.action}
                </p>
                <p className="text-xs text-gray-500">
                  Baseado em: {camp.status === 'scaling' ? 'ROI alto e CPL baixo - aumentar investimento' : 
                              camp.status === 'optimizing' ? 'Performance estável - manter budget atual' :
                              'ROI baixo e CPL alto - reduzir budget e testar novos criativos'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">⚙️ Configurações de Auto-Scaling</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-[#151515]">
            <label className="block text-sm font-semibold text-white mb-2">ROI mínimo para escalar</label>
            <input type="number" defaultValue="250" className="w-full rounded-lg bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-2 text-white" />
            <p className="text-xs text-gray-500 mt-1">Campanhas com ROI acima deste valor terão budget aumentado</p>
          </div>
          <div className="p-4 rounded-lg bg-[#151515]">
            <label className="block text-sm font-semibold text-white mb-2">CPL máximo aceitável</label>
            <input type="number" defaultValue="35.00" step="0.10" className="w-full rounded-lg bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-2 text-white" />
            <p className="text-xs text-gray-500 mt-1">Campanhas com CPL acima deste valor terão budget reduzido</p>
          </div>
          <div className="p-4 rounded-lg bg-[#151515]">
            <label className="block text-sm font-semibold text-white mb-2">% de aumento máximo por dia</label>
            <input type="number" defaultValue="20" className="w-full rounded-lg bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-2 text-white" />
          </div>
          <div className="p-4 rounded-lg bg-[#151515]">
            <label className="block text-sm font-semibold text-white mb-2">% de redução máxima por dia</label>
            <input type="number" defaultValue="50" className="w-full rounded-lg bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-2 text-white" />
          </div>
        </div>
        <button className="mt-6 px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors">
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
