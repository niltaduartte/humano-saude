'use client';

import { Image, Video, FileText, Star } from 'lucide-react';

export default function CriativosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CRIATIVOS
        </h1>
        <p className="mt-2 text-gray-400">
          Biblioteca de anúncios e análise de performance criativa
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Image className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">127</p>
          <p className="mt-1 text-sm text-gray-400">Imagens</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Video className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">34</p>
          <p className="mt-1 text-sm text-gray-400">Vídeos</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <FileText className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">89</p>
          <p className="mt-1 text-sm text-gray-400">Copies</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Star className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">4.7</p>
          <p className="mt-1 text-sm text-gray-400">Score médio IA</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors text-sm">
          Todos
        </button>
        <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors text-sm">
          Imagens
        </button>
        <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors text-sm">
          Vídeos
        </button>
        <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors text-sm">
          Alto Desempenho
        </button>
      </div>

      {/* Creatives Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] overflow-hidden hover:border-[#D4AF37]/50 transition-all cursor-pointer group">
            {/* Image Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-[#D4AF37]/20 to-[#AA8A2E]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image className="h-16 w-16 text-[#D4AF37]/50" />
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">Criativo {i}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-white">4.{i}</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                Plano de saúde ideal para sua família. Cobertura nacional, sem carência.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#D4AF37]/20">
                <div>
                  <p className="text-xs text-gray-500">Impressões</p>
                  <p className="text-sm font-semibold text-white">12.5K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">CTR</p>
                  <p className="text-sm font-semibold text-[#D4AF37]">2.8%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Leads</p>
                  <p className="text-sm font-semibold text-green-500">47</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
