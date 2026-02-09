'use client';

import { AtSign, Bell } from 'lucide-react';

export default function MentionsPage() {
  const mentions = [
    { user: '@cliente_feliz', platform: '📘', text: 'Adorei o atendimento da Humano Saúde!', sentiment: 'positive', time: '2h atrás' },
    { user: '@joao_silva', platform: '📷', text: 'Alguém já usou os planos da Humano?', sentiment: 'neutral', time: '4h atrás' },
    { user: '@maria_costa', platform: '💼', text: 'Excelente custo-benefício!', sentiment: 'positive', time: '6h atrás' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          MENÇÕES
        </h1>
        <p className="mt-2 text-gray-400">Monitore menções à sua marca nas redes sociais</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Total Menções', value: '247', icon: AtSign, color: 'text-[#D4AF37]' },
          { label: 'Positivas', value: '189', icon: '😊', color: 'text-green-500' },
          { label: 'Pendentes Resposta', value: '23', icon: Bell, color: 'text-yellow-500' },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            {typeof stat.icon === 'string' ? (
              <div className="text-3xl mb-4">{stat.icon}</div>
            ) : (
              <stat.icon className={`h-8 w-8 ${stat.color} mb-4`} />
            )}
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Menções Recentes</h3>
        </div>

        <div className="divide-y divide-[#D4AF37]/10">
          {mentions.map((mention, i) => (
            <div key={i} className="p-6 hover:bg-[#151515] transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mention.platform}</span>
                  <span className="font-semibold text-white">{mention.user}</span>
                  <span className="text-sm text-gray-500">{mention.time}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  mention.sentiment === 'positive' ? 'bg-green-500/20 text-green-500' :
                  mention.sentiment === 'negative' ? 'bg-red-500/20 text-red-500' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {mention.sentiment === 'positive' ? '😊 Positivo' : mention.sentiment === 'negative' ? '😞 Negativo' : '😐 Neutro'}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{mention.text}</p>
              <div className="flex gap-3">
                <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Responder</button>
                <button className="text-sm text-gray-400 hover:text-white">Marcar como lido</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
