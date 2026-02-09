'use client';

import { TrendingUp, BarChart3, DollarSign, Users } from 'lucide-react';

export default function HibridoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          ANÁLISE HÍBRIDA
        </h1>
        <p className="mt-2 text-gray-400">
          Visão consolidada multi-dimensional das campanhas
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <TrendingUp className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">342%</p>
          <p className="mt-1 text-sm text-gray-400">ROI Geral</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Users className="h-8 w-8 text-blue-500 mb-4" />
          <p className="text-3xl font-bold text-white">3.847</p>
          <p className="mt-1 text-sm text-gray-400">Total Leads</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <DollarSign className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-3xl font-bold text-white">R$ 11.08</p>
          <p className="mt-1 text-sm text-gray-400">CPL Médio</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <BarChart3 className="h-8 w-8 text-purple-500 mb-4" />
          <p className="text-3xl font-bold text-white">24.5%</p>
          <p className="mt-1 text-sm text-gray-400">Taxa Conversão</p>
        </div>
      </div>

      {/* Cross-Analysis Matrix */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-6">Matriz de Análise Cruzada</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#151515] border-b border-[#D4AF37]/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Segmento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Plataforma</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Idade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Leads</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">CPL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Conv.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10">
              {[
                { segment: 'Mobile + F + 35-44', platform: '📱', age: '35-44', leads: 247, cpl: 9.80, conv: 28.4, score: 9.2 },
                { segment: 'Mobile + M + 25-34', platform: '📱', age: '25-34', leads: 198, cpl: 10.20, conv: 26.1, score: 8.8 },
                { segment: 'Desktop + F + 45-54', platform: '💻', age: '45-54', leads: 156, cpl: 12.50, conv: 29.7, score: 8.5 },
                { segment: 'Mobile + F + 25-34', platform: '📱', age: '25-34', leads: 134, cpl: 10.80, conv: 24.9, score: 8.1 },
                { segment: 'Desktop + M + 35-44', platform: '💻', age: '35-44', leads: 112, cpl: 13.40, conv: 27.3, score: 7.9 },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#151515] transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{row.segment}</td>
                  <td className="px-6 py-4 text-2xl">{row.platform}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{row.age}</td>
                  <td className="px-6 py-4 text-sm text-[#D4AF37] font-semibold">{row.leads}</td>
                  <td className="px-6 py-4 text-sm text-white">R$ {row.cpl.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-green-500">{row.conv}%</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      row.score >= 9 ? 'bg-green-500/20 text-green-500' :
                      row.score >= 8 ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {row.score}/10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Opportunities */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">🎯 Oportunidades de Otimização</h3>
          <div className="space-y-4">
            {[
              { title: 'Mobile + Feminino 35-44', impact: 'Alto', action: 'Aumentar budget +30%' },
              { title: 'Desktop + Alta Conversão', impact: 'Médio', action: 'Criar criativos específicos' },
              { title: 'Segmento 25-34', impact: 'Médio', action: 'Testar novos criativos' },
            ].map((opp, i) => (
              <div key={i} className="p-4 rounded-lg bg-[#151515] border border-[#D4AF37]/10">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-white">{opp.title}</p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    opp.impact === 'Alto' ? 'bg-red-500/20 text-red-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {opp.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{opp.action}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">💡 Insights Estratégicos</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span><strong>Mobile + Feminino + 35-44</strong> é o segmento com melhor performance geral</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Desktop tem <strong>taxa de conversão 11% maior</strong> apesar do CPL mais alto</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Faixa 25-44 anos concentra <strong>72% dos leads</strong> - segmento ideal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Considere realocação de 20% do budget para top 3 segmentos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>ROI pode aumentar <strong>+45%</strong> com otimização sugerida</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Performance Heatmap */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-6">Mapa de Calor de Performance</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          🗺️ Heatmap - Performance por segmento (cor = ROI)
        </div>
      </div>
    </div>
  );
}
