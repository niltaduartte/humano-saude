'use client';

import { BarChart3, PieChart, LineChart, TrendingUp } from 'lucide-react';

export default function ConsolidadoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CONSOLIDADO
        </h1>
        <p className="mt-2 text-gray-400">
          Dashboard executivo com todas as métricas consolidadas
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Leads Total', value: '3.847', icon: BarChart3, color: 'text-[#D4AF37]' },
          { label: 'Taxa Conversão', value: '24.5%', icon: TrendingUp, color: 'text-green-500' },
          { label: 'Ticket Médio', value: 'R$ 1.247', icon: PieChart, color: 'text-blue-500' },
          { label: 'ROI Campanhas', value: '342%', icon: LineChart, color: 'text-purple-500' },
        ].map((kpi, i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <kpi.icon className={`h-8 w-8 ${kpi.color} mb-4`} />
            <p className="text-3xl font-bold text-white">{kpi.value}</p>
            <p className="mt-1 text-sm text-gray-400">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Performance Mensal</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            📊 Gráfico de Performance
          </div>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Distribuição por Operadora</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            🥧 Gráfico Pizza
          </div>
        </div>
      </div>
    </div>
  );
}
