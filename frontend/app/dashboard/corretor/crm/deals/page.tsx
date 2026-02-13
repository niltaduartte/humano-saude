'use client';

import { useState, useCallback } from 'react';
import { Briefcase, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';
import { useCorretorId } from '../../hooks/useCorretorToken';
import { useCorretorDeals, useCorretorKanban, useCorretorDealDrawer } from '../hooks/useCorretorCrm';
import { createDeal } from '@/app/actions/crm';
import DealsTable from '@/app/portal-interno-hks-2026/crm/components/DealsTable';
import AdminKanbanBoard from '@/app/portal-interno-hks-2026/crm/components/AdminKanbanBoard';
import DealDrawer from '@/app/portal-interno-hks-2026/crm/components/DealDrawer';
import type { CrmDealFilters, CrmDealInsert, CrmDealEnriched } from '@/lib/types/crm';

type ViewMode = 'kanban' | 'list';

export default function CorretorDealsPage() {
  const corretorId = useCorretorId();
  const [view, setView] = useState<ViewMode>('kanban');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Kanban
  const kanban = useCorretorKanban(corretorId || null);

  // Deal list
  const dealsList = useCorretorDeals(corretorId || null);

  // Drawer
  const drawer = useCorretorDealDrawer(selectedDealId);

  const handleDealClick = useCallback((deal: CrmDealEnriched) => {
    setSelectedDealId(deal.id);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedDealId(null);
  }, []);

  const handleNewDeal = useCallback(async () => {
    if (!corretorId || !kanban.board) return;
    const firstStage = kanban.board.stages[0];
    if (!firstStage) {
      toast.error('Nenhuma etapa disponível');
      return;
    }

    const input: CrmDealInsert = {
      pipeline_id: kanban.board.pipeline.id,
      stage_id: firstStage.id,
      contact_id: null,
      company_id: null,
      owner_corretor_id: corretorId,
      crm_card_id: null,
      lead_id: null,
      titulo: 'Novo Deal',
      valor: null,
      valor_recorrente: null,
      moeda: 'BRL',
      data_previsao_fechamento: null,
      data_ganho: null,
      data_perda: null,
      probabilidade: firstStage.probabilidade ?? null,
      posicao: 0,
      motivo_perda: null,
      motivo_perda_detalhe: null,
      score: 0,
      prioridade: 'media',
      is_hot: false,
      is_stale: false,
      dias_no_stage: 0,
      tags: [],
      custom_fields: {},
      metadata: {},
    };

    const res = await createDeal(input);
    if (res.success) {
      toast.success('Deal criado!');
      kanban.fetchBoard();
      dealsList.refetch();
    } else {
      toast.error(res.error ?? 'Erro ao criar deal');
    }
  }, [corretorId, kanban, dealsList]);

  const handleFilterChange = useCallback((partial: Partial<CrmDealFilters>) => {
    for (const [key, value] of Object.entries(partial)) {
      dealsList.updateFilter(key as keyof CrmDealFilters, value);
    }
  }, [dealsList]);

  if (!corretorId) return null;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-[#D4AF37]" />
            Meus <span className="text-[#D4AF37]">Deals</span>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Pipeline de negócios e oportunidades
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-xl bg-white/5 p-1">
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === 'kanban' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === 'list' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <List className="h-3.5 w-3.5" /> Lista
            </button>
          </div>
          <button
            onClick={handleNewDeal}
            className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#F6E05E] transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            Novo Deal
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <AdminKanbanBoard
          board={kanban.board}
          pipelines={kanban.pipelines}
          activePipelineId={kanban.activePipelineId}
          loading={kanban.loading}
          onPipelineChange={kanban.setActivePipelineId}
          onMoveDeal={(dealId, sourceStageId, destStageId, pos) =>
            kanban.handleMoveDeal(dealId, sourceStageId, destStageId, pos)
          }
          onDealClick={handleDealClick}
          onAddDeal={() => handleNewDeal()}
          corretorId={corretorId}
        />
      )}

      {/* List View */}
      {view === 'list' && dealsList.result && (
        <DealsTable
          deals={dealsList.result.data}
          loading={dealsList.loading}
          total={dealsList.result.total}
          page={dealsList.result.page}
          perPage={dealsList.result.perPage}
          filters={dealsList.filters}
          onFilterChange={handleFilterChange}
          onPageChange={(p) => dealsList.updateFilter('page', p)}
          onRowClick={handleDealClick}
        />
      )}

      {/* Deal Drawer */}
      <DealDrawer
        deal={drawer.deal}
        activities={drawer.activities}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        onAddActivity={drawer.addActivity}
        loading={drawer.loading}
      />
    </div>
  );
}
