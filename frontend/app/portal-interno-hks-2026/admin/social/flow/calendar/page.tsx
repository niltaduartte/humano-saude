'use client';

import { Calendar as CalendarIcon, Plus, Clock } from 'lucide-react';

export default function CalendarPage() {
  const posts = [
    { date: '2026-02-10', time: '09:00', platform: '📘 Facebook', content: 'Plano Família Unimed - 30% OFF', status: 'scheduled' },
    { date: '2026-02-10', time: '14:00', platform: '📷 Instagram', content: 'Stories: Cobertura Nacional', status: 'scheduled' },
    { date: '2026-02-11', time: '10:00', platform: '💼 LinkedIn', content: 'Planos Empresariais', status: 'scheduled' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CALENDÁRIO SOCIAL
        </h1>
        <p className="mt-2 text-gray-400">Agendamento e gerenciamento de posts nas redes sociais</p>
      </div>

      <div className="flex gap-4">
        <button className="px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Agendar Post
        </button>
        <button className="px-6 py-3 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
          Ver Calendário Completo
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Agendados', value: '24', icon: CalendarIcon, color: 'text-blue-500' },
          { label: 'Publicados Hoje', value: '3', icon: Clock, color: 'text-green-500' },
          { label: 'Rascunhos', value: '7', icon: '📝', color: 'text-yellow-500' },
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
          <h3 className="text-lg font-semibold text-[#D4AF37]">Próximos Posts Agendados</h3>
        </div>

        <div className="divide-y divide-[#D4AF37]/10">
          {posts.map((post, i) => (
            <div key={i} className="p-6 flex justify-between items-center hover:bg-[#151515] transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#D4AF37]">{post.date.split('-')[2]}</p>
                  <p className="text-xs text-gray-500">FEV</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{post.platform.split(' ')[0]}</span>
                    <span className="font-semibold text-white">{post.platform.split(' ')[1]}</span>
                    <span className="text-sm text-gray-400">{post.time}</span>
                  </div>
                  <p className="text-sm text-gray-400">{post.content}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Editar</button>
                <button className="text-sm text-gray-400 hover:text-white">Cancelar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
