'use client';

import { ArrowUpRight, TrendingUp, Users, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header com fonte Perpetua Titling MT */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          ANALYTICS
        </h1>
        <p className="mt-2 text-gray-400">
          Análise completa de performance e métricas de negócio
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center justify-between">
            <Eye className="h-8 w-8 text-[#D4AF37]" />
            <ArrowUpRight className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">15.234</p>
          <p className="mt-1 text-sm text-gray-400">Visitas no mês</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center justify-between">
            <Users className="h-8 w-8 text-[#D4AF37]" />
            <ArrowUpRight className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">3.847</p>
          <p className="mt-1 text-sm text-gray-400">Leads gerados</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-8 w-8 text-[#D4AF37]" />
            <ArrowUpRight className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">24.5%</p>
          <p className="mt-1 text-sm text-gray-400">Taxa de conversão</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold">R$</div>
            <ArrowUpRight className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">R$ 127.4K</p>
          <p className="mt-1 text-sm text-gray-400">Receita recorrente</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-8">
        <p className="text-center text-gray-400">
          🚧 Dashboard de Analytics em desenvolvimento
        </p>
      </div>
    </div>
  );
}
