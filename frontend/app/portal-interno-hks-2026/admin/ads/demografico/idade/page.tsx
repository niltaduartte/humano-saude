'use client';

import { Users, TrendingUp } from 'lucide-react';

export default function IdadePage() {
  const ageGroups = [
    { range: '18-24', percentage: 12, leads: 87, cpl: 14.50 },
    { range: '25-34', percentage: 28, leads: 247, cpl: 11.20 },
    { range: '35-44', percentage: 32, leads: 389, cpl: 10.80 },
    { range: '45-54', percentage: 18, leads: 198, cpl: 12.40 },
    { range: '55-64', percentage: 8, leads: 92, cpl: 15.70 },
    { range: '65+', percentage: 2, leads: 24, cpl: 18.90 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          DEMOGRÁFICO - IDADE
        </h1>
        <p className="mt-2 text-gray-400">
          Análise de performance por faixa etária
        </p>
      </div>

      {/* Top Performers */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <TrendingUp className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-sm text-gray-400 mb-1">Faixa com mais leads</p>
          <p className="text-3xl font-bold text-white">35-44</p>
          <p className="text-sm text-[#D4AF37] mt-1">389 leads (32%)</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <TrendingUp className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-sm text-gray-400 mb-1">Melhor CPL</p>
          <p className="text-3xl font-bold text-white">35-44</p>
          <p className="text-sm text-green-500 mt-1">R$ 10.80</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Users className="h-8 w-8 text-blue-500 mb-4" />
          <p className="text-sm text-gray-400 mb-1">Total de leads</p>
          <p className="text-3xl font-bold text-white">1.037</p>
          <p className="text-sm text-blue-500 mt-1">Todas as faixas</p>
        </div>
      </div>

      {/* Age Groups Table */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] overflow-hidden">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Performance por Faixa Etária</h3>
        </div>

        <div className="p-6 space-y-4">
          {ageGroups.map((group, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">{group.range} anos</span>
                <div className="flex gap-6 text-sm">
                  <span className="text-gray-400">{group.leads} leads</span>
                  <span className="text-[#D4AF37]">R$ {group.cpl.toFixed(2)} CPL</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-8 bg-[#151515] rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37] to-[#F6E05E] flex items-center justify-end pr-3"
                  style={{ width: `${group.percentage}%` }}
                >
                  <span className="text-xs font-bold text-black">{group.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">💡 Insights da IA</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37]">•</span>
            <span>A faixa 35-44 anos apresenta o <strong>melhor custo-benefício</strong> com CPL de R$ 10.80</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37]">•</span>
            <span>Considere aumentar investimento em campanhas para <strong>25-44 anos</strong> (60% dos leads)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37]">•</span>
            <span>Faixa 65+ tem CPL alto (R$ 18.90) - avaliar segmentação específica</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
