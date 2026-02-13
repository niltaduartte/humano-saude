'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw, DollarSign, Target, Flame, AlertTriangle, Clock, Briefcase, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCorretorId } from '../../hooks/useCorretorToken';
import { useCrmStats } from '../hooks/useCrmStats';
import { useCorretorCrmMetrics } from '../hooks/useCorretorCrm';
import { getPipelines } from '@/app/actions/crm';
import CrmStatsCards from '../components/CrmStatsCards';
import FunnelChart from '../components/FunnelChart';
import type { CrmPipeline, CrmStageWithMetrics } from '@/lib/types/crm';

// ========================================
// STAT CARD (Advanced metrics)
// ========================================

function AdvancedStatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color = 'gold',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subValue?: string;
  color?: string;
}) {
  const colorMap: Record<string, { text: string; bg: string }> = {
    gold: { text: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10' },
    green: { text: 'text-green-400', bg: 'bg-green-500/10' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10' },
    red: { text: 'text-red-400', bg: 'bg-red-500/10' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/10' },
  };
  const c = colorMap[color] ?? colorMap.gold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-5"
    >
      <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-3', c.bg)}>
        <Icon className={cn('h-5 w-5', c.text)} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/40 mt-1">{label}</p>
      {subValue && <p className="text-[10px] text-white/20 mt-0.5">{subValue}</p>}
    </motion.div>
  );
}

function fmt(value: number | null | undefined): string {
  if (value == null) return '—';
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// ========================================
// FUNNEL BAR
// ========================================

function StageFunnel({ stages }: { stages: CrmStageWithMetrics[] }) {
  const maxTotal = Math.max(...stages.map((s) => s.total_deals), 1);

  return (
    <div className="space-y-2">
      {stages.map((stage) => (
        <div key={stage.id} className="flex items-center gap-3">
          <span className="text-xs text-white/50 w-28 truncate text-right">{stage.nome}</span>
          <div className="flex-1 h-7 rounded-lg bg-white/[0.03] overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stage.total_deals / maxTotal) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-lg flex items-center px-3"
              style={{ backgroundColor: `${stage.cor}40` }}
            >
              <span className="text-[11px] font-medium text-white whitespace-nowrap">
                {stage.total_deals} — {fmt(stage.valor_total)}
              </span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ========================================
// PAGE
// ========================================

export default function CorretorAnalyticsPage() {
  const corretorId = useCorretorId();
  const { stats, loading: statsLoading, refetch: refetchStats } = useCrmStats(corretorId);
  const advanced = useCorretorCrmMetrics();
  const [selectedPipelineId, setSelectedPipelineId] = useState('');

  // Load default pipeline
  useEffect(() => {
    getPipelines().then((res) => {
      if (res.success && res.data?.length) {
        const def = res.data.find((p) => p.is_default) ?? res.data[0];
        if (def) {
          setSelectedPipelineId(def.id);
          advanced.refetch(def.id);
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!corretorId) return null;

  const m = advanced.metrics;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#D4AF37]" />
            Analytics <span className="text-[#D4AF37]">CRM</span>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Performance, funil e métricas avançadas
          </p>
        </div>
        <button
          onClick={() => { refetchStats(); advanced.refetch(selectedPipelineId); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/60 text-sm hover:bg-white/[0.06] transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Original CRM Stats (from crm_cards) */}
      <CrmStatsCards stats={stats} loading={statsLoading} />

      {/* Advanced Metrics (from crm_deals) */}
      {m && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <AdvancedStatCard icon={Briefcase} label="Total Deals" value={m.total_deals.toLocaleString()} color="gold" />
          <AdvancedStatCard icon={DollarSign} label="Valor Pipeline" value={fmt(m.valor_total_pipeline)} color="green" />
          <AdvancedStatCard icon={Target} label="Forecast" value={fmt(m.forecast_ponderado)} color="blue" />
          <AdvancedStatCard icon={Flame} label="Deals Hot" value={(m.deals_hot ?? 0).toLocaleString()} color="gold" />
          <AdvancedStatCard icon={AlertTriangle} label="Deals Parados" value={(m.deals_stale ?? 0).toLocaleString()} color="red" />
          <AdvancedStatCard
            icon={Clock}
            label="Tempo Médio Fech."
            value={m.tempo_medio_fechamento_dias != null ? `${m.tempo_medio_fechamento_dias}d` : '—'}
            color="purple"
          />
        </div>
      )}

      {/* Funnel original */}
      <FunnelChart stats={stats} loading={statsLoading} />

      {/* Advanced Stage Funnel */}
      {advanced.stageMetrics.length > 0 && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#D4AF37]" />
            Funil por Etapa (Deals Avançado)
          </h3>
          <StageFunnel stages={advanced.stageMetrics} />
        </div>
      )}
    </div>
  );
}
