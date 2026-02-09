'use client';

import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

export default function EngajamentoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          ENGAJAMENTO
        </h1>
        <p className="mt-2 text-gray-400">
          Análise de interações e engajamento nas campanhas
        </p>
      </div>

      {/* Engagement Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Heart className="h-8 w-8 text-red-500 mb-4" />
          <p className="text-3xl font-bold text-white">47.2K</p>
          <p className="mt-1 text-sm text-gray-400">Reações</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <MessageCircle className="h-8 w-8 text-blue-500 mb-4" />
          <p className="text-3xl font-bold text-white">8.9K</p>
          <p className="mt-1 text-sm text-gray-400">Comentários</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Share2 className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-3xl font-bold text-white">12.1K</p>
          <p className="mt-1 text-sm text-gray-400">Compartilhamentos</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Bookmark className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">3.4K</p>
          <p className="mt-1 text-sm text-gray-400">Salvamentos</p>
        </div>
      </div>

      {/* Engagement Rate Trend */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-6">Taxa de Engajamento</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          📈 Gráfico de linha - Taxa de engajamento ao longo do tempo
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Posts com Melhor Engajamento</h3>
        </div>

        <div className="divide-y divide-[#D4AF37]/10">
          {[
            { title: 'Plano Família Unimed - 30% OFF', reactions: 8900, comments: 1240, shares: 2870, rate: 8.4 },
            { title: 'Cobertura Nacional sem Carência', reactions: 7200, comments: 980, shares: 2100, rate: 7.1 },
            { title: 'Bradesco Saúde Empresarial', reactions: 6500, comments: 750, shares: 1890, rate: 6.8 },
            { title: 'Amil Individual - Telemedicina', reactions: 5800, comments: 640, shares: 1670, rate: 6.2 },
          ].map((post, i) => (
            <div key={i} className="p-6 hover:bg-[#151515] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-white">{post.title}</h4>
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-semibold">
                  {post.rate}% eng.
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-400">{post.reactions.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-400">{post.comments.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-400">{post.shares.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-sm text-gray-400">{Math.floor(post.shares / 2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement by Type */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Distribuição de Interações</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Reações</span>
                <span className="text-gray-400">66%</span>
              </div>
              <div className="h-3 bg-[#151515] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: '66%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Compartilhamentos</span>
                <span className="text-gray-400">17%</span>
              </div>
              <div className="h-3 bg-[#151515] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: '17%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Comentários</span>
                <span className="text-gray-400">12%</span>
              </div>
              <div className="h-3 bg-[#151515] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '12%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Salvamentos</span>
                <span className="text-gray-400">5%</span>
              </div>
              <div className="h-3 bg-[#151515] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F6E05E]" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">💡 Insights da IA</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Taxa de engajamento média de <strong>7.1%</strong> - acima do benchmark</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Posts com desconto têm <strong>40% mais engajamento</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Compartilhamentos indicam <strong>viralização potencial</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37]">•</span>
              <span>Responda aos comentários para aumentar alcance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
