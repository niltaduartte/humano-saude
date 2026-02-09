'use client';

import { Users, Target, TrendingUp, Zap } from 'lucide-react';

export default function AudiencesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          AUDIENCES IA
        </h1>
        <p className="mt-2 text-gray-400">
          Criação e otimização inteligente de públicos com IA
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button className="px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Gerar Público com IA
        </button>
        <button className="px-6 py-3 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
          Importar do Meta
        </button>
      </div>

      {/* Audience Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Users className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">34</p>
          <p className="mt-1 text-sm text-gray-400">Públicos ativos</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Target className="h-8 w-8 text-blue-500 mb-4" />
          <p className="text-3xl font-bold text-white">2.8M</p>
          <p className="mt-1 text-sm text-gray-400">Alcance total</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <TrendingUp className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-3xl font-bold text-white">R$ 9.80</p>
          <p className="mt-1 text-sm text-gray-400">CPL médio</p>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Zap className="h-8 w-8 text-purple-500 mb-4" />
          <p className="text-3xl font-bold text-white">12</p>
          <p className="mt-1 text-sm text-gray-400">Lookalikes IA</p>
        </div>
      </div>

      {/* AI-Generated Audiences */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Públicos Gerados por IA</h3>
        </div>

        <div className="divide-y divide-[#D4AF37]/10">
          {[
            { 
              name: 'Famílias 35-44 SP - Alta Renda', 
              size: 487000, 
              cpl: 9.20, 
              score: 9.4,
              characteristics: ['Idade 35-44', 'São Paulo', 'Renda R$ 10K+', 'Família 3+']
            },
            { 
              name: 'Profissionais Liberais 30-50', 
              size: 312000, 
              cpl: 10.80, 
              score: 8.9,
              characteristics: ['Profissionais', 'Autônomo/PJ', 'Interesse saúde', 'Alta qualificação']
            },
            { 
              name: 'Lookalike - Top Converters', 
              size: 890000, 
              cpl: 8.50, 
              score: 9.7,
              characteristics: ['Similar aos melhores clientes', '1% população', 'Alto intent', 'Taxa conv. 32%']
            },
          ].map((audience, i) => (
            <div key={i} className="p-6 hover:bg-[#151515] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-white">{audience.name}</h4>
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-500">
                      🤖 IA
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{audience.size.toLocaleString('pt-BR')} pessoas</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">Score IA:</span>
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-bold">
                      {audience.score}/10
                    </span>
                  </div>
                  <p className="text-sm text-[#D4AF37]">CPL: R$ {audience.cpl.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {audience.characteristics.map((char, j) => (
                  <span key={j} className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs">
                    {char}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors text-sm">
                  Criar Campanha
                </button>
                <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors text-sm">
                  Exportar para Meta
                </button>
                <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors text-sm">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">💡 Sugestões da IA</h3>
        <div className="space-y-4">
          {[
            { 
              title: 'Criar Lookalike 2% baseado em clientes Premium', 
              impact: 'Alto', 
              estimated_cpl: 9.50,
              estimated_leads: 450
            },
            { 
              title: 'Segmentar empresas 50-200 funcionários em SP/RJ', 
              impact: 'Médio', 
              estimated_cpl: 12.30,
              estimated_leads: 280
            },
            { 
              title: 'Expandir para público 45-54 anos - baixa competição', 
              impact: 'Médio', 
              estimated_cpl: 11.80,
              estimated_leads: 320
            },
          ].map((suggestion, i) => (
            <div key={i} className="p-4 rounded-lg bg-[#151515] border border-[#D4AF37]/10">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-white mb-2">{suggestion.title}</p>
                  <div className="flex gap-6 text-sm">
                    <span className="text-gray-400">CPL estimado: <strong className="text-[#D4AF37]">R$ {suggestion.estimated_cpl.toFixed(2)}</strong></span>
                    <span className="text-gray-400">Leads estimados: <strong className="text-green-500">{suggestion.estimated_leads}</strong></span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  suggestion.impact === 'Alto' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {suggestion.impact} Impacto
                </span>
              </div>
              <button className="mt-2 text-sm text-[#D4AF37] hover:text-[#F6E05E] font-semibold">
                Aplicar sugestão →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
