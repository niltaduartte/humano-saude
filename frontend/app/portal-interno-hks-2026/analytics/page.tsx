'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Eye, MousePointer, Clock, Globe, Smartphone, Monitor, Tablet, ArrowUpRight } from 'lucide-react';
import { getAnalyticsStats, getAnalyticsVisits } from '@/app/actions/analytics';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  async function load() {
    const [sRes, vRes] = await Promise.all([
      getAnalyticsStats(days),
      getAnalyticsVisits({ limit: 50 }),
    ]);
    if (sRes.success) setStats(sRes.data);
    if (vRes.success) setVisits(vRes.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [days]);

  const deviceIcon = (device: string) => {
    if (device?.toLowerCase().includes('mobile')) return Smartphone;
    if (device?.toLowerCase().includes('tablet')) return Tablet;
    return Monitor;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
            ANALYTICS
          </h1>
          <p className="mt-2 text-gray-400">Tráfego e comportamento dos visitantes</p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => { setLoading(true); setDays(d); }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                days === d ? 'bg-[#D4AF37] text-black' : 'border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5">
              <Eye className="h-5 w-5 text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">{(stats?.total_visitas || 0).toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-400">Visitas ({days} dias)</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5">
              <MousePointer className="h-5 w-5 text-purple-400 mb-2" />
              <p className="text-2xl font-bold text-white">{(stats?.page_views || 0).toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-400">Page Views</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5">
              <Globe className="h-5 w-5 text-green-400 mb-2" />
              <p className="text-2xl font-bold text-white">{stats?.sessoes_unicas || 0}</p>
              <p className="text-xs text-gray-400">Sessões Únicas</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5">
              <Clock className="h-5 w-5 text-yellow-400 mb-2" />
              <p className="text-2xl font-bold text-white">{stats?.duracao_media || 0}s</p>
              <p className="text-xs text-gray-400">Duração Média</p>
            </div>
          </div>

          {/* Top Páginas + Fontes */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Top Páginas</h2>
              <div className="space-y-3">
                {(stats?.top_paginas || []).slice(0, 10).map((p: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-bold text-[#D4AF37]">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white truncate">{p.pagina}</span>
                        <span className="text-xs text-gray-400 ml-2">{p.views}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F6E05E] rounded-full"
                          style={{ width: `${(p.views / (stats?.top_paginas?.[0]?.views || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!stats?.top_paginas || stats.top_paginas.length === 0) && (
                  <p className="text-center text-sm text-gray-500 py-4">Sem dados</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Fontes de Tráfego</h2>
              <div className="space-y-3">
                {(stats?.fontes || []).slice(0, 10).map((f: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-white/5 p-3">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-[#D4AF37]" />
                      <span className="text-sm text-white">{f.fonte || 'Direto'}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#D4AF37]">{f.count}</span>
                  </div>
                ))}
                {(!stats?.fontes || stats.fontes.length === 0) && (
                  <p className="text-center text-sm text-gray-500 py-4">Sem dados</p>
                )}
              </div>
            </div>
          </div>

          {/* Dispositivos */}
          <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Dispositivos</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(stats?.dispositivos || {}).map(([device, count]) => {
                const Icon = deviceIcon(device);
                return (
                  <div key={device} className="rounded-lg border border-white/5 p-4 flex items-center gap-4">
                    <Icon className="h-8 w-8 text-[#D4AF37]" />
                    <div>
                      <p className="text-xl font-bold text-white">{count as number}</p>
                      <p className="text-sm text-gray-400 capitalize">{device}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Últimas Visitas */}
          <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Últimas Visitas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-gray-400">
                    <th className="pb-2 pr-4">Página</th>
                    <th className="pb-2 pr-4">Fonte</th>
                    <th className="pb-2 pr-4">Dispositivo</th>
                    <th className="pb-2 pr-4">IP</th>
                    <th className="pb-2 pr-4">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.slice(0, 20).map((v) => (
                    <tr key={v.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 pr-4 text-white truncate max-w-[200px]">{v.page_url || '/'}</td>
                      <td className="py-2 pr-4 text-gray-300">{v.utm_source || v.referrer || 'Direto'}</td>
                      <td className="py-2 pr-4 text-gray-300 capitalize">{v.device_type || '—'}</td>
                      <td className="py-2 pr-4 text-gray-400 font-mono text-xs">{v.ip_address || '—'}</td>
                      <td className="py-2 pr-4 text-gray-400 text-xs">
                        {v.created_at ? new Date(v.created_at).toLocaleString('pt-BR') : '—'}
                      </td>
                    </tr>
                  ))}
                  {visits.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-500">Nenhuma visita registrada</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
