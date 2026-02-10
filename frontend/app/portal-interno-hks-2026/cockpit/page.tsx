'use client';

import { useState, useEffect } from 'react';
import { Gauge, TrendingUp, Users, Target, DollarSign, ArrowUpRight, ArrowDownRight, BarChart3, Activity } from 'lucide-react';
import { getClienteStats } from '@/app/actions/clientes';
import { getCotacaoStats } from '@/app/actions/cotacoes';
import { getPropostaStats } from '@/app/actions/propostas';
import { getAdsStats } from '@/app/actions/ads';
import { getAnalyticsStats } from '@/app/actions/analytics';

export default function CockpitPage() {
  const [cliente, setCliente] = useState<any>(null);
  const [cotacao, setCotacao] = useState<any>(null);
  const [proposta, setProposta] = useState<any>(null);
  const [ads, setAds] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [cRes, cotRes, pRes, adsRes, aRes] = await Promise.all([
        getClienteStats(),
        getCotacaoStats(),
        getPropostaStats(),
        getAdsStats(),
        getAnalyticsStats(30),
      ]);
      if (cRes.success) setCliente(cRes.data);
      if (cotRes.success) setCotacao(cotRes.data);
      if (pRes.success) setProposta(pRes.data);
      if (adsRes.success) setAds(adsRes.data);
      if (aRes.success) setAnalytics(aRes.data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          COCKPIT
        </h1>
        <p className="mt-2 text-gray-400">Visão consolidada de todos os indicadores</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Big Numbers */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[
              {
                label: 'Visitas (30d)',
                value: analytics?.total_visitas || 0,
                icon: Activity,
                color: 'text-blue-400',
                border: 'border-blue-500/20',
              },
              {
                label: 'Clientes Ativos',
                value: cliente?.total_clientes || 0,
                icon: Users,
                color: 'text-green-400',
                border: 'border-green-500/20',
              },
              {
                label: 'Cotações (Total)',
                value: cotacao?.total || 0,
                icon: Target,
                color: 'text-purple-400',
                border: 'border-purple-500/20',
              },
              {
                label: 'Propostas Ativas',
                value: proposta?.ativas || 0,
                icon: TrendingUp,
                color: 'text-[#D4AF37]',
                border: 'border-[#D4AF37]/20',
              },
              {
                label: 'Receita Recorrente',
                value: cliente?.receita_recorrente
                  ? `R$ ${cliente.receita_recorrente.toLocaleString('pt-BR')}`
                  : 'R$ 0',
                icon: DollarSign,
                color: 'text-emerald-400',
                border: 'border-emerald-500/20',
              },
            ].map((item, i) => (
              <div key={i} className={`rounded-lg border ${item.border} bg-[#0a0a0a] p-5`}>
                <item.icon className={`h-6 w-6 ${item.color} mb-3`} />
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Conversão + Ads */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Taxas de Conversão */}
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-[#D4AF37]" /> Taxas de Conversão
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Visita → Lead', value: analytics?.total_visitas && (cliente?.total_clientes || 0) ? (((cliente?.total_clientes || 0) / analytics.total_visitas) * 100).toFixed(1) : '0', target: '3-5%' },
                  { label: 'Cotação → Proposta', value: cotacao?.taxa_conversao || 0, target: '25-30%' },
                  { label: 'Proposta → Ativa', value: proposta?.total && proposta?.ativas ? ((proposta.ativas / proposta.total) * 100).toFixed(1) : '0', target: '60-70%' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <span className="text-sm font-bold text-[#D4AF37]">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F6E05E] rounded-full transition-all"
                        style={{ width: `${Math.min(Number(item.value), 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 mt-0.5">Meta: {item.target}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ads Overview */}
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#D4AF37]" /> Meta Ads
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Investimento', value: ads?.investimento_total ? `R$ ${ads.investimento_total.toLocaleString('pt-BR')}` : 'R$ 0' },
                  { label: 'Leads Gerados', value: ads?.leads_gerados || 0 },
                  { label: 'CPL Médio', value: ads?.cpl_medio ? `R$ ${ads.cpl_medio.toFixed(2)}` : '—' },
                  { label: 'CTR Médio', value: ads?.ctr_medio ? `${ads.ctr_medio}%` : '—' },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border border-white/5 p-3 text-center">
                    <p className="text-lg font-bold text-white">{item.value}</p>
                    <p className="text-xs text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pages + Fontes */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
              <h2 className="text-sm font-semibold text-gray-400 mb-3">TOP PÁGINAS (30d)</h2>
              <div className="space-y-2">
                {(analytics?.top_paginas || []).slice(0, 5).map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 truncate">{p.pagina}</span>
                    <span className="text-[#D4AF37] font-semibold ml-2">{p.views}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
              <h2 className="text-sm font-semibold text-gray-400 mb-3">TOP FONTES (30d)</h2>
              <div className="space-y-2">
                {(analytics?.fontes || []).slice(0, 5).map((f: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{f.fonte || 'Direto'}</span>
                    <span className="text-[#D4AF37] font-semibold ml-2">{f.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pipeline Resumo */}
          <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Resumo Financeiro</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#D4AF37]">
                  {cliente?.receita_recorrente ? `R$ ${cliente.receita_recorrente.toLocaleString('pt-BR')}` : 'R$ 0'}
                </p>
                <p className="text-sm text-gray-400 mt-1">MRR (Receita Mensal Recorrente)</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {cliente?.ticket_medio ? `R$ ${cliente.ticket_medio.toLocaleString('pt-BR')}` : 'R$ 0'}
                </p>
                <p className="text-sm text-gray-400 mt-1">Ticket Médio</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {proposta?.receita_recorrente ? `R$ ${proposta.receita_recorrente.toLocaleString('pt-BR')}` : 'R$ 0'}
                </p>
                <p className="text-sm text-gray-400 mt-1">Receita Propostas Ativas</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
