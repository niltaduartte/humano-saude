'use client';

import { useState, useEffect } from 'react';
import {
  Gauge, TrendingUp, Users, Target, DollarSign, BarChart3,
  Activity, ArrowUpRight, ArrowDownRight, Zap, PieChart,
} from 'lucide-react';
import { getClienteStats } from '@/app/actions/clientes';
import { getCotacaoStats } from '@/app/actions/cotacoes';
import { getPropostaStats } from '@/app/actions/propostas';
import { getFinanceiroStats } from '@/app/actions/comissoes';
import { getAdsStats } from '@/app/actions/ads';
import { getAnalyticsStats } from '@/app/actions/analytics';
import { getLeads } from '@/app/actions/leads';
import { getTarefaStats } from '@/app/actions/tarefas';

export default function ConsolidadoPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [cRes, cotRes, pRes, fRes, adsRes, aRes, lRes, tRes] = await Promise.all([
        getClienteStats(),
        getCotacaoStats(),
        getPropostaStats(),
        getFinanceiroStats(),
        getAdsStats(),
        getAnalyticsStats(30),
        getLeads(),
        getTarefaStats(),
      ]);
      setData({
        cliente: cRes.success ? cRes.data : null,
        cotacao: cotRes.success ? cotRes.data : null,
        proposta: pRes.success ? pRes.data : null,
        financeiro: fRes.success ? fRes.data : null,
        ads: adsRes.success ? adsRes.data : null,
        analytics: aRes.success ? aRes.data : null,
        leads: lRes.success ? lRes.data : [],
        tarefas: tRes.success ? tRes.data : null,
      });
      setLoading(false);
    }
    load();
  }, []);

  const fmt = (v: number) =>
    `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  const d = data;
  const leadsNovos = (d.leads || []).filter((l: any) => l.status === 'novo').length;
  const leadsTotal = (d.leads || []).length;

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          PAINEL CONSOLIDADO
        </h1>
        <p className="mt-2 text-gray-400">Visão 360° de todas as métricas do negócio</p>
      </div>

      {/* Big Numbers - Top Row */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Leads Total', value: leadsTotal, icon: Users, color: 'text-blue-400' },
          { label: 'Leads Novos', value: leadsNovos, icon: Zap, color: 'text-yellow-400' },
          { label: 'Cotações', value: d.cotacao?.total || 0, icon: Target, color: 'text-purple-400' },
          { label: 'Propostas', value: d.proposta?.total || 0, icon: TrendingUp, color: 'text-cyan-400' },
          { label: 'Clientes', value: d.cliente?.total_clientes || 0, icon: Users, color: 'text-green-400' },
          { label: 'Visitas (30d)', value: d.analytics?.total_visitas || 0, icon: Activity, color: 'text-pink-400' },
        ].map((item, i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-[#0a0a0a] p-4 text-center">
            <item.icon className={`h-5 w-5 ${item.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-white">{typeof item.value === 'number' ? item.value.toLocaleString('pt-BR') : item.value}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Financeiro */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'MRR', value: d.cliente?.receita_recorrente ? fmt(d.cliente.receita_recorrente) : 'R$ 0', icon: DollarSign, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'Ticket Médio', value: d.cliente?.ticket_medio ? fmt(d.cliente.ticket_medio) : 'R$ 0', icon: BarChart3, color: 'text-[#D4AF37]', border: 'border-[#D4AF37]/20' },
          { label: 'Comissões Pendentes', value: d.financeiro?.total_pendente ? fmt(d.financeiro.total_pendente) : 'R$ 0', icon: DollarSign, color: 'text-yellow-400', border: 'border-yellow-500/20' },
          { label: 'Comissões Pagas', value: d.financeiro?.total_pago ? fmt(d.financeiro.total_pago) : 'R$ 0', icon: DollarSign, color: 'text-green-400', border: 'border-green-500/20' },
        ].map((item, i) => (
          <div key={i} className={`rounded-lg border ${item.border} bg-[#0a0a0a] p-5`}>
            <item.icon className={`h-6 w-6 ${item.color} mb-3`} />
            <p className="text-xl font-bold text-white">{item.value}</p>
            <p className="text-xs text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Funil + Conversão */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Funil */}
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <h2 className="text-lg font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5" /> Funil de Vendas
          </h2>
          <div className="space-y-3">
            {[
              { etapa: 'Visitas', valor: d.analytics?.total_visitas || 0, pct: 100, color: 'bg-blue-500' },
              { etapa: 'Leads', valor: leadsTotal, pct: d.analytics?.total_visitas ? Math.round((leadsTotal / d.analytics.total_visitas) * 100) : 0, color: 'bg-purple-500' },
              { etapa: 'Cotações', valor: d.cotacao?.total || 0, pct: leadsTotal ? Math.round(((d.cotacao?.total || 0) / leadsTotal) * 100) : 0, color: 'bg-cyan-500' },
              { etapa: 'Propostas', valor: d.proposta?.total || 0, pct: d.cotacao?.total ? Math.round(((d.proposta?.total || 0) / d.cotacao.total) * 100) : 0, color: 'bg-yellow-500' },
              { etapa: 'Clientes', valor: d.cliente?.total_clientes || 0, pct: d.proposta?.total ? Math.round(((d.cliente?.total_clientes || 0) / d.proposta.total) * 100) : 0, color: 'bg-emerald-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.etapa}</span>
                  <span className="text-white font-semibold">{item.valor.toLocaleString('pt-BR')} <span className="text-gray-500 text-xs">({item.pct}%)</span></span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${Math.max(item.pct, 2)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Taxas de Conversão */}
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-[#D4AF37]" /> Taxas de Conversão
          </h2>
          <div className="space-y-4">
            {[
              {
                label: 'Visita → Lead',
                value: d.analytics?.total_visitas && leadsTotal ? ((leadsTotal / d.analytics.total_visitas) * 100).toFixed(1) : '0',
                target: '3-5%',
                good: 3,
              },
              {
                label: 'Lead → Cotação',
                value: leadsTotal && d.cotacao?.total ? ((d.cotacao.total / leadsTotal) * 100).toFixed(1) : '0',
                target: '40-60%',
                good: 40,
              },
              {
                label: 'Cotação → Proposta',
                value: d.cotacao?.taxa_conversao || 0,
                target: '25-30%',
                good: 25,
              },
              {
                label: 'Proposta → Cliente',
                value: d.proposta?.total && d.cliente?.total_clientes ? ((d.cliente.total_clientes / d.proposta.total) * 100).toFixed(1) : '0',
                target: '60-70%',
                good: 60,
              },
            ].map((item, i) => {
              const v = Number(item.value);
              const isGood = v >= item.good;
              return (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <span className={`text-sm font-bold ${isGood ? 'text-green-400' : 'text-[#D4AF37]'}`}>
                      {item.value}%
                      {isGood ? <ArrowUpRight className="inline h-3 w-3 ml-1" /> : <ArrowDownRight className="inline h-3 w-3 ml-1" />}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isGood ? 'bg-green-500' : 'bg-gradient-to-r from-[#D4AF37] to-[#F6E05E]'}`}
                      style={{ width: `${Math.min(v, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-600 mt-0.5">Meta: {item.target}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ads + Tarefas */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Ads */}
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#D4AF37]" /> Meta Ads
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Investimento', value: d.ads?.investimento_total ? fmt(d.ads.investimento_total) : 'R$ 0' },
              { label: 'Leads Gerados', value: d.ads?.leads_gerados || 0 },
              { label: 'CPL Médio', value: d.ads?.cpl_medio ? fmt(d.ads.cpl_medio) : '—' },
              { label: 'CTR Médio', value: d.ads?.ctr_medio ? `${d.ads.ctr_medio}%` : '—' },
              { label: 'Campanhas Ativas', value: d.ads?.campanhas_ativas || 0 },
              { label: 'Total Campanhas', value: d.ads?.total_campanhas || 0 },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-white/5 p-3 text-center">
                <p className="text-lg font-bold text-white">{item.value}</p>
                <p className="text-xs text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tarefas */}
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#D4AF37]" /> Tarefas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total', value: d.tarefas?.total || 0 },
              { label: 'Pendentes', value: d.tarefas?.pendentes || 0 },
              { label: 'Em Andamento', value: d.tarefas?.em_andamento || 0 },
              { label: 'Concluídas', value: d.tarefas?.concluidas || 0 },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-white/5 p-3 text-center">
                <p className="text-lg font-bold text-white">{item.value}</p>
                <p className="text-xs text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Top Páginas (30d)</h2>
          <div className="space-y-2">
            {(d.analytics?.top_paginas || []).slice(0, 5).map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 truncate">{p.pagina}</span>
                <span className="text-[#D4AF37] font-semibold ml-2">{p.views}</span>
              </div>
            ))}
            {(!d.analytics?.top_paginas || d.analytics.top_paginas.length === 0) && (
              <p className="text-sm text-gray-600">Sem dados de páginas</p>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Fontes de Tráfego (30d)</h2>
          <div className="space-y-2">
            {(d.analytics?.fontes || []).slice(0, 5).map((f: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{f.fonte || 'Direto'}</span>
                <span className="text-[#D4AF37] font-semibold ml-2">{f.count}</span>
              </div>
            ))}
            {(!d.analytics?.fontes || d.analytics.fontes.length === 0) && (
              <p className="text-sm text-gray-600">Sem dados de fontes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
