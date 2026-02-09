'use client';

import { Clock, Filter, TrendingUp, TrendingDown } from 'lucide-react';

export default function HistoricoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          HISTÓRICO
        </h1>
        <p className="mt-2 text-gray-400">
          Timeline completo de campanhas e performance histórica
        </p>
      </div>

      {/* Period Filters */}
      <div className="flex gap-3 flex-wrap">
        <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors text-sm">
          Últimos 30 dias
        </button>
        <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors text-sm">
          Últimos 90 dias
        </button>
        <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors text-sm">
          Este ano
        </button>
        <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors text-sm flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Personalizar
        </button>
      </div>

      {/* Performance Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Clock className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">89</p>
          <p className="mt-1 text-sm text-gray-400">Campanhas no período</p>
        </div>

        <div className="rounded-lg border border-green-500/20 bg-[#0a0a0a] p-6">
          <TrendingUp className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-3xl font-bold text-white">R$ 127K</p>
          <p className="mt-1 text-sm text-gray-400">Investimento total</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold mb-4">👥</div>
          <p className="text-3xl font-bold text-white">11.2K</p>
          <p className="mt-1 text-sm text-gray-400">Leads gerados</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-500 font-bold mb-4">%</div>
          <p className="text-3xl font-bold text-white">287%</p>
          <p className="mt-1 text-sm text-gray-400">ROI médio</p>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-6">Tendência Histórica de Performance</h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          📈 Gráfico de área - Leads, Investimento e ROI ao longo do tempo
        </div>
      </div>

      {/* Campaign History Timeline */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Timeline de Campanhas</h3>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {[
              { month: 'Janeiro 2026', campaigns: 8, leads: 1247, investment: 42700, roi: 342, trend: 'up' },
              { month: 'Dezembro 2025', campaigns: 7, leads: 1089, investment: 38900, roi: 312, trend: 'up' },
              { month: 'Novembro 2025', campaigns: 9, leads: 1334, investment: 45200, roi: 298, trend: 'up' },
              { month: 'Outubro 2025', campaigns: 6, leads: 847, investment: 32100, roi: 267, trend: 'down' },
            ].map((period, i) => (
              <div key={i} className="relative pl-8 pb-6 border-l-2 border-[#D4AF37]/20 last:pb-0">
                <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-[#D4AF37] border-4 border-[#0a0a0a]" />
                
                <div className="rounded-lg bg-[#151515] p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{period.month}</h4>
                      <p className="text-sm text-gray-400">{period.campaigns} campanhas ativas</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {period.trend === 'up' ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`text-sm font-semibold ${
                        period.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {period.roi}% ROI
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Leads</p>
                      <p className="text-lg font-semibold text-white">{period.leads.toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Investimento</p>
                      <p className="text-lg font-semibold text-white">R$ {(period.investment / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CPL Médio</p>
                      <p className="text-lg font-semibold text-[#D4AF37]">
                        R$ {(period.investment / period.leads).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Melhores Meses</h3>
          <div className="space-y-3">
            {[
              { month: 'Novembro 2025', metric: '1.334 leads', badge: '🥇' },
              { month: 'Janeiro 2026', metric: 'R$ 10.80 CPL', badge: '🥈' },
              { month: 'Janeiro 2026', metric: '342% ROI', badge: '🥉' },
            ].map((best, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#151515]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{best.badge}</span>
                  <div>
                    <p className="font-semibold text-white">{best.month}</p>
                    <p className="text-sm text-gray-400">{best.metric}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">💡 Insights Históricos</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>ROI teve crescimento de <strong>28%</strong> nos últimos 3 meses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>CPL diminuiu <strong>15%</strong> após otimizações de novembro</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Janeiro teve pico sazonal - considerar para próximo ano</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Média de 8 campanhas/mês é o sweet spot de eficiência</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
