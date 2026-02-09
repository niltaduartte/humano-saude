'use client';

import { Users, Mail, Phone, MapPin } from 'lucide-react';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CLIENTES
        </h1>
        <p className="mt-2 text-gray-400">
          Base de clientes ativos com contratos vigentes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Users className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">892</p>
          <p className="mt-1 text-sm text-gray-400">Clientes Ativos</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold mb-4">R$</div>
          <p className="text-3xl font-bold text-white">R$ 127K</p>
          <p className="mt-1 text-sm text-gray-400">Receita Mensal</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-500 font-bold mb-4">%</div>
          <p className="text-3xl font-bold text-white">94.2%</p>
          <p className="mt-1 text-sm text-gray-400">Taxa de Retenção</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 font-bold mb-4">↑</div>
          <p className="text-3xl font-bold text-white">R$ 1.247</p>
          <p className="mt-1 text-sm text-gray-400">Ticket Médio</p>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6 hover:border-[#D4AF37]/50 transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-lg">
                JS
              </div>
              <div>
                <h3 className="font-semibold text-white">João Silva {i}</h3>
                <p className="text-sm text-gray-400">Cliente desde 2023</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>joao{i}@email.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+55 11 99999-999{i}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>São Paulo - SP</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Valor mensal</span>
                <span className="text-lg font-bold text-[#D4AF37]">R$ 1.247</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
