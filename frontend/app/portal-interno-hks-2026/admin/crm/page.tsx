'use client';

import { Users, UserPlus, Filter, Search } from 'lucide-react';

export default function CRMPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CRM
        </h1>
        <p className="mt-2 text-gray-400">
          Gestão completa de leads e relacionamento com clientes
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Novo Lead
          </button>
          <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar leads..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#151515] border border-[#D4AF37]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Total Leads', value: '3.847', color: 'bg-blue-500/20 text-blue-500' },
          { label: 'Novos (7d)', value: '247', color: 'bg-green-500/20 text-green-500' },
          { label: 'Em Negociação', value: '156', color: 'bg-yellow-500/20 text-yellow-500' },
          { label: 'Convertidos', value: '892', color: 'bg-[#D4AF37]/20 text-[#D4AF37]' },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mb-3 ${stat.color}`}>
              {stat.label}
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Leads Table */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#151515] border-b border-[#D4AF37]/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Contato</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Operadora</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Valor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-[#151515] transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-sm text-white font-medium">João Silva {i}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">joao{i}@email.com</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500">
                      Novo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">Unimed</td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">R$ 1.247</td>
                  <td className="px-6 py-4 text-sm text-gray-400">Hoje</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
