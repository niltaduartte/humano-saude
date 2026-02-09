'use client';

import { Plus, Eye } from 'lucide-react';

export default function StoriesPage() {
  const stories = [
    { title: 'Plano Família', views: 12400, date: 'Hoje', platform: '📷' },
    { title: 'Cobertura Nacional', views: 9800, date: 'Ontem', platform: '📘' },
    { title: 'Telemedicina 24h', views: 15200, date: '2 dias atrás', platform: '📷' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          STORIES
        </h1>
        <p className="mt-2 text-gray-400">Gerencie stories do Instagram e Facebook</p>
      </div>

      <button className="px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors flex items-center gap-2">
        <Plus className="h-5 w-5" />
        Criar Story
      </button>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story, i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] overflow-hidden group cursor-pointer hover:border-[#D4AF37]/50 transition-all">
            <div className="aspect-[9/16] bg-gradient-to-br from-[#D4AF37]/20 to-[#AA8A2E]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-6xl">{story.platform}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2">{story.title}</h3>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Eye className="h-4 w-4" />
                  <span>{story.views.toLocaleString('pt-BR')} views</span>
                </div>
                <span className="text-gray-500">{story.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
