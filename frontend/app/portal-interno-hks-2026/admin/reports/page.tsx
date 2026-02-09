'use client';

import { FileText, Download, Calendar, Filter } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          RELATÓRIOS
        </h1>
        <p className="mt-2 text-gray-400">
          Relatórios executivos e análises personalizadas
        </p>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-4 flex-wrap">
        <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Este mês
        </button>
        <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros avançados
        </button>
        <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar todos
        </button>
      </div>

      {/* Report Types Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Performance de Vendas', desc: 'Análise completa de conversões e receita', icon: '📈' },
          { title: 'Leads por Operadora', desc: 'Distribuição e preferências', icon: '🏥' },
          { title: 'ROI de Campanhas', desc: 'Retorno sobre investimento em Meta Ads', icon: '💰' },
          { title: 'Comissões', desc: 'Relatório de comissões por período', icon: '💵' },
          { title: 'Retenção de Clientes', desc: 'Taxa de renovação e churn', icon: '🔄' },
          { title: 'Analytics Completo', desc: 'Dashboard executivo consolidado', icon: '📊' },
        ].map((report, i) => (
          <div key={i} className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6 hover:border-[#D4AF37]/50 transition-all cursor-pointer group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{report.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{report.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{report.desc}</p>
            <button className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#F6E05E] transition-colors">
              <Download className="h-4 w-4" />
              Gerar relatório
            </button>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Relatórios Recentes</h3>
        </div>
        <div className="divide-y divide-[#D4AF37]/10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-[#151515] transition-colors">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-[#D4AF37]" />
                <div>
                  <p className="font-semibold text-white">Relatório Mensal - Janeiro 2026</p>
                  <p className="text-sm text-gray-400">Gerado em 01/02/2026 às 10:30</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors text-sm">
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
