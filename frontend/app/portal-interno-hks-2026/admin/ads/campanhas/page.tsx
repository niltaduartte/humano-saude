'use client';

import { Target, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function CampanhasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CAMPANHAS META ADS
        </h1>
        <p className="mt-2 text-gray-400">
          Gerenciamento e análise de campanhas publicitárias
        </p>
      </div>

      {/* Performance Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Target className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">24</p>
          <p className="mt-1 text-sm text-gray-400">Campanhas ativas</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <DollarSign className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">R$ 42.7K</p>
          <p className="mt-1 text-sm text-gray-400">Investido este mês</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Users className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">3.847</p>
          <p className="mt-1 text-sm text-gray-400">Leads gerados</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <TrendingUp className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">R$ 11.08</p>
          <p className="mt-1 text-sm text-gray-400">CPL médio</p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Suas Campanhas</h3>
          <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors text-sm">
            Nova Campanha
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#151515] border-b border-[#D4AF37]/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Impressões</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Cliques</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Leads</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10">
              {[
                { name: 'Plano Familiar Unimed', status: 'active', budget: 5000, impressions: 45200, clicks: 1240, leads: 187, cpl: 26.74 },
                { name: 'Empresarial Bradesco', status: 'active', budget: 8000, impressions: 67500, clicks: 1890, leads: 234, cpl: 34.19 },
                { name: 'Individual Amil', status: 'paused', budget: 3500, impressions: 28900, clicks: 780, leads: 95, cpl: 36.84 },
              ].map((campaign, i) => (
                <tr key={i} className="hover:bg-[#151515] transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-sm text-white font-medium">{campaign.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      campaign.status === 'active' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {campaign.status === 'active' ? 'Ativa' : 'Pausada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">R$ {campaign.budget.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{campaign.impressions.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{campaign.clicks.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm text-[#D4AF37] font-semibold">{campaign.leads}</td>
                  <td className="px-6 py-4 text-sm text-white">R$ {campaign.cpl.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
