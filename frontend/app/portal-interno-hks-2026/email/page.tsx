'use client';

import { useState } from 'react';
import { Mail, Send, Inbox, FileEdit, Users, Clock, Eye, PenTool } from 'lucide-react';

interface EmailCampaign {
  id: string;
  assunto: string;
  status: 'rascunho' | 'agendada' | 'enviada';
  destinatarios: number;
  aberturas: number;
  cliques: number;
  data: string;
}

const MOCK_CAMPAIGNS: EmailCampaign[] = [
  { id: '1', assunto: 'Novo plano com economia de até 40%', status: 'enviada', destinatarios: 245, aberturas: 89, cliques: 23, data: '2025-01-15' },
  { id: '2', assunto: 'Renovação do seu plano - Condições especiais', status: 'enviada', destinatarios: 132, aberturas: 56, cliques: 18, data: '2025-01-10' },
  { id: '3', assunto: 'Dicas de saúde para começar o ano bem', status: 'agendada', destinatarios: 340, aberturas: 0, cliques: 0, data: '2025-01-20' },
  { id: '4', assunto: 'Campanha de reengajamento - Janeiro', status: 'rascunho', destinatarios: 0, aberturas: 0, cliques: 0, data: '2025-01-18' },
];

export default function EmailPage() {
  const [campaigns] = useState(MOCK_CAMPAIGNS);
  const [tab, setTab] = useState<'todas' | 'enviadas' | 'agendadas' | 'rascunhos'>('todas');

  const filtered = campaigns.filter((c) => {
    if (tab === 'todas') return true;
    if (tab === 'enviadas') return c.status === 'enviada';
    if (tab === 'agendadas') return c.status === 'agendada';
    if (tab === 'rascunhos') return c.status === 'rascunho';
    return true;
  });

  const totalEnviados = campaigns.filter((c) => c.status === 'enviada').reduce((s, c) => s + c.destinatarios, 0);
  const totalAberturas = campaigns.reduce((s, c) => s + c.aberturas, 0);
  const taxaAbertura = totalEnviados > 0 ? ((totalAberturas / totalEnviados) * 100).toFixed(1) : '0';

  const statusStyle: Record<string, string> = {
    rascunho: 'bg-gray-500/20 text-gray-400',
    agendada: 'bg-blue-500/20 text-blue-400',
    enviada: 'bg-green-500/20 text-green-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
            EMAIL
          </h1>
          <p className="mt-2 text-gray-400">Campanhas de email marketing</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#F6E05E] transition-colors">
          <PenTool className="h-4 w-4" /> Nova Campanha
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5">
          <Send className="h-5 w-5 text-[#D4AF37] mb-2" />
          <p className="text-2xl font-bold text-white">{campaigns.length}</p>
          <p className="text-xs text-gray-400">Campanhas</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5">
          <Users className="h-5 w-5 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">{totalEnviados}</p>
          <p className="text-xs text-gray-400">Emails Enviados</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5">
          <Eye className="h-5 w-5 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-white">{taxaAbertura}%</p>
          <p className="text-xs text-gray-400">Taxa de Abertura</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5">
          <Inbox className="h-5 w-5 text-purple-400 mb-2" />
          <p className="text-2xl font-bold text-white">{campaigns.reduce((s, c) => s + c.cliques, 0)}</p>
          <p className="text-xs text-gray-400">Cliques Totais</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'todas' as const, label: 'Todas' },
          { key: 'enviadas' as const, label: 'Enviadas' },
          { key: 'agendadas' as const, label: 'Agendadas' },
          { key: 'rascunhos' as const, label: 'Rascunhos' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-[#D4AF37] text-black'
                : 'border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400 bg-white/5">
                <th className="px-4 py-3">Assunto</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Destinatários</th>
                <th className="px-4 py-3">Aberturas</th>
                <th className="px-4 py-3">Cliques</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{c.assunto}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{c.destinatarios}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {c.aberturas} {c.destinatarios > 0 && <span className="text-[#D4AF37] text-xs">({((c.aberturas / c.destinatarios) * 100).toFixed(0)}%)</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{c.cliques}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.data).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Nenhuma campanha encontrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
