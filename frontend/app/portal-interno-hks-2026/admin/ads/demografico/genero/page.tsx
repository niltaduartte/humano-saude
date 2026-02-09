'use client';

import { User, Users } from 'lucide-react';

export default function GeneroPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          DEMOGRÁFICO - GÊNERO
        </h1>
        <p className="mt-2 text-gray-400">
          Análise de performance por gênero
        </p>
      </div>

      {/* Gender Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-8 w-8 text-blue-500" />
            <h3 className="text-xl font-bold text-white">Masculino</h3>
          </div>
          <p className="text-4xl font-bold text-white mb-2">547</p>
          <p className="text-sm text-gray-400">leads (47%)</p>
          <p className="text-lg text-[#D4AF37] mt-4">R$ 12.30 CPL</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-8 w-8 text-pink-500" />
            <h3 className="text-xl font-bold text-white">Feminino</h3>
          </div>
          <p className="text-4xl font-bold text-white mb-2">612</p>
          <p className="text-sm text-gray-400">leads (53%)</p>
          <p className="text-lg text-[#D4AF37] mt-4">R$ 11.80 CPL</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="text-xl font-bold text-white">Total</h3>
          </div>
          <p className="text-4xl font-bold text-white mb-2">1.159</p>
          <p className="text-sm text-gray-400">leads (100%)</p>
          <p className="text-lg text-[#D4AF37] mt-4">R$ 12.00 CPL</p>
        </div>
      </div>

      {/* Visual Distribution */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-6">Distribuição por Gênero</h3>
        
        <div className="space-y-6">
          {/* Masculino */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-white font-semibold">Masculino</span>
              <span className="text-gray-400">47%</span>
            </div>
            <div className="h-12 bg-[#151515] rounded-lg overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center" style={{ width: '47%' }}>
                <span className="font-bold text-white">547 leads</span>
              </div>
            </div>
          </div>

          {/* Feminino */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-white font-semibold">Feminino</span>
              <span className="text-gray-400">53%</span>
            </div>
            <div className="h-12 bg-[#151515] rounded-lg overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-pink-400 flex items-center justify-center" style={{ width: '53%' }}>
                <span className="font-bold text-white">612 leads</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Métricas Comparativas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/10">
              <span className="text-gray-400">Impressões</span>
              <div className="flex gap-6">
                <span className="text-blue-400">67.2K</span>
                <span className="text-pink-400">72.8K</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/10">
              <span className="text-gray-400">Cliques</span>
              <div className="flex gap-6">
                <span className="text-blue-400">1.847</span>
                <span className="text-pink-400">2.103</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/10">
              <span className="text-gray-400">CTR</span>
              <div className="flex gap-6">
                <span className="text-blue-400">2.75%</span>
                <span className="text-pink-400">2.89%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Taxa Conversão</span>
              <div className="flex gap-6">
                <span className="text-blue-400">29.6%</span>
                <span className="text-pink-400">29.1%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">💡 Insights da IA</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Público feminino tem <strong>CPL 4% menor</strong> (R$ 11.80 vs R$ 12.30)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>CTR feminino é <strong>5% maior</strong>, indicando melhor engajamento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Taxa de conversão similar (~29%) - públicos igualmente qualificados</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Considere criativos específicos para cada gênero</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
