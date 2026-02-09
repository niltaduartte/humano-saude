'use client';

import { Smartphone, Monitor, Tablet } from 'lucide-react';

export default function PlataformaPage() {
  const platforms = [
    { name: 'Mobile', icon: Smartphone, leads: 789, percentage: 68, cpl: 10.50, color: 'text-blue-500' },
    { name: 'Desktop', icon: Monitor, leads: 287, percentage: 25, cpl: 14.20, color: 'text-purple-500' },
    { name: 'Tablet', icon: Tablet, leads: 83, percentage: 7, cpl: 16.80, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          DEMOGRÁFICO - PLATAFORMA
        </h1>
        <p className="mt-2 text-gray-400">
          Análise de performance por dispositivo
        </p>
      </div>

      {/* Platform Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {platforms.map((platform, i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <platform.icon className={`h-10 w-10 ${platform.color} mb-4`} />
            <h3 className="text-2xl font-bold text-white mb-2">{platform.name}</h3>
            <p className="text-4xl font-bold text-white mb-2">{platform.leads}</p>
            <p className="text-sm text-gray-400 mb-4">{platform.percentage}% dos leads</p>
            <p className="text-lg text-[#D4AF37]">R$ {platform.cpl.toFixed(2)} CPL</p>
          </div>
        ))}
      </div>

      {/* Visual Distribution */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-6">Distribuição por Plataforma</h3>
        
        <div className="space-y-6">
          {platforms.map((platform, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <platform.icon className={`h-5 w-5 ${platform.color}`} />
                  <span className="text-white font-semibold">{platform.name}</span>
                </div>
                <span className="text-gray-400">{platform.percentage}%</span>
              </div>
              <div className="h-10 bg-[#151515] rounded-lg overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    i === 0 ? 'from-blue-500 to-blue-400' :
                    i === 1 ? 'from-purple-500 to-purple-400' :
                    'from-green-500 to-green-400'
                  } flex items-center justify-center`}
                  style={{ width: `${platform.percentage}%` }}
                >
                  <span className="font-bold text-white">{platform.leads} leads</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] overflow-hidden">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Métricas Detalhadas</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#151515] border-b border-[#D4AF37]/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Plataforma</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Impressões</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Cliques</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">CTR</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Leads</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Conv. Rate</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10">
              <tr className="hover:bg-[#151515] transition-colors">
                <td className="px-6 py-4 text-sm text-white font-medium flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  Mobile
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">98.7K</td>
                <td className="px-6 py-4 text-sm text-gray-400">3.247</td>
                <td className="px-6 py-4 text-sm text-white">3.29%</td>
                <td className="px-6 py-4 text-sm text-[#D4AF37] font-semibold">789</td>
                <td className="px-6 py-4 text-sm text-white">24.3%</td>
                <td className="px-6 py-4 text-sm text-white">R$ 10.50</td>
              </tr>
              <tr className="hover:bg-[#151515] transition-colors">
                <td className="px-6 py-4 text-sm text-white font-medium flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-purple-500" />
                  Desktop
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">34.2K</td>
                <td className="px-6 py-4 text-sm text-gray-400">1.089</td>
                <td className="px-6 py-4 text-sm text-white">3.18%</td>
                <td className="px-6 py-4 text-sm text-[#D4AF37] font-semibold">287</td>
                <td className="px-6 py-4 text-sm text-white">26.4%</td>
                <td className="px-6 py-4 text-sm text-white">R$ 14.20</td>
              </tr>
              <tr className="hover:bg-[#151515] transition-colors">
                <td className="px-6 py-4 text-sm text-white font-medium flex items-center gap-2">
                  <Tablet className="h-4 w-4 text-green-500" />
                  Tablet
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">12.1K</td>
                <td className="px-6 py-4 text-sm text-gray-400">347</td>
                <td className="px-6 py-4 text-sm text-white">2.87%</td>
                <td className="px-6 py-4 text-sm text-[#D4AF37] font-semibold">83</td>
                <td className="px-6 py-4 text-sm text-white">23.9%</td>
                <td className="px-6 py-4 text-sm text-white">R$ 16.80</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">💡 Insights da IA</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37]">•</span>
            <span><strong>Mobile domina</strong> com 68% dos leads e melhor CPL (R$ 10.50)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37]">•</span>
            <span>Desktop tem <strong>maior taxa de conversão</strong> (26.4%) - leads mais qualificados</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37]">•</span>
            <span>Mobile tem CTR mais alto (3.29%) - priorize criativos mobile-first</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37]">•</span>
            <span>Tablet representa apenas 7% - considere realocação de budget</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
