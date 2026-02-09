'use client';

import { BarChart3, TrendingUp, Heart, MessageCircle } from 'lucide-react';

export default function SocialAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          ANALYTICS SOCIAL
        </h1>
        <p className="mt-2 text-gray-400">Métricas e desempenho das redes sociais</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { icon: BarChart3, label: 'Posts', value: '127', change: '+12%', color: 'text-[#D4AF37]' },
          { icon: TrendingUp, label: 'Alcance', value: '284K', change: '+28%', color: 'text-green-500' },
          { icon: Heart, label: 'Engajamento', value: '47.2K', change: '+15%', color: 'text-red-500' },
          { icon: MessageCircle, label: 'Interações', value: '21.1K', change: '+19%', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <stat.icon className={`h-8 w-8 ${stat.color} mb-4`} />
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <span className="text-sm text-green-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-6">Performance por Plataforma</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          📊 Gráfico de barras - Comparação entre plataformas
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Posts com Melhor Desempenho</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-[#151515] flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">Plano Família Unimed</p>
                  <p className="text-sm text-gray-400">47.2K engajamento</p>
                </div>
                <span className="text-xl">📘</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Melhores Horários</h3>
          <div className="space-y-3">
            {['09:00 - 11:00', '14:00 - 16:00', '19:00 - 21:00'].map((time, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#151515] flex justify-between items-center">
                <span className="text-white">{time}</span>
                <span className="text-[#D4AF37]">+{(3 - i) * 15}% alcance</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
