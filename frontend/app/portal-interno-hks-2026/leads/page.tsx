'use client';

import { useState, useEffect, useMemo } from 'react';
import { Users, Phone, Mail, ArrowUpRight, CheckCircle, XCircle, Pause, MessageSquare } from 'lucide-react';
import { getLeads, updateLeadStatus } from '@/app/actions/leads';
import type { LeadStatus } from '@/lib/types/database';
import { LEAD_STATUS } from '@/lib/types/database';
import {
  PageHeader,
  StatsCard,
  StatsGrid,
  StatusBadge,
  SearchInput,
  FilterSelect,
  DataTable,
  PageLoading,
} from '../components';
import type { Column } from '../components';
import { LeadDialog } from '../components/LeadDialog';
import { LeadDetailDrawer } from '../components/LeadDetailDrawer';
import { toast } from 'sonner';

// ============================================
// CONFIGURAÇÃO DE STATUS
// ============================================

const statusConfig: Record<LeadStatus, { label: string; color: string; icon: React.ComponentType<any> }> = {
  novo: { label: 'Novo', color: 'bg-blue-500/20 text-blue-400', icon: ArrowUpRight },
  contatado: { label: 'Contatado', color: 'bg-yellow-500/20 text-yellow-400', icon: Phone },
  negociacao: { label: 'Negociação', color: 'bg-purple-500/20 text-purple-400', icon: MessageSquare },
  proposta_enviada: { label: 'Proposta Enviada', color: 'bg-orange-500/20 text-orange-400', icon: Mail },
  ganho: { label: 'Ganho', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  perdido: { label: 'Perdido', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  pausado: { label: 'Pausado', color: 'bg-gray-500/20 text-gray-400', icon: Pause },
};

// ============================================
// COLUNAS DA TABELA
// ============================================

function makeColumns(onStatusChange: (id: string, status: string) => void): Column<any>[] {
  return [
    {
      key: 'nome',
      header: 'Nome',
      sortable: true,
      render: (lead) => (
        <div>
          <p className="font-medium text-white">{lead.nome}</p>
          {lead.email && <p className="text-xs text-gray-500">{lead.email}</p>}
        </div>
      ),
    },
    {
      key: 'whatsapp',
      header: 'WhatsApp',
      render: (lead) =>
        lead.whatsapp ? (
          <a
            href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            {lead.whatsapp}
          </a>
        ) : (
          <span className="text-gray-500">—</span>
        ),
    },
    {
      key: 'operadora_atual',
      header: 'Operadora Atual',
      hidden: 'md',
      sortable: true,
      render: (lead) => <span className="text-gray-400">{lead.operadora_atual || '—'}</span>,
    },
    {
      key: 'valor_atual',
      header: 'Valor Atual',
      hidden: 'lg',
      sortable: true,
      render: (lead) => (
        <span className="text-gray-400">
          {lead.valor_atual ? `R$ ${Number(lead.valor_atual).toLocaleString('pt-BR')}` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => {
        const cfg = statusConfig[lead.status as LeadStatus] || statusConfig.novo;
        return <StatusBadge label={cfg.label} color={cfg.color} icon={cfg.icon} />;
      },
    },
    {
      key: 'created_at',
      header: 'Data',
      hidden: 'lg',
      sortable: true,
      render: (lead) => (
        <span className="text-gray-500">
          {lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Ação',
      width: '120px',
      render: (lead) => (
        <select
          value={lead.status}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(lead.id, e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          className="rounded border border-white/10 bg-transparent px-2 py-1 text-xs text-gray-300 focus:border-[#D4AF37]/50 focus:outline-none"
        >
          {LEAD_STATUS.map((s) => (
            <option key={s} value={s} className="bg-[#0a0a0a]">
              {statusConfig[s].label}
            </option>
          ))}
        </select>
      ),
    },
  ];
}

// ============================================
// PÁGINA PRINCIPAL
// ============================================

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function loadLeads() {
    setLoading(true);
    const result = await getLeads({
      status: filterStatus || undefined,
      limit: 100,
    });
    if (result.success) setLeads(result.data);
    setLoading(false);
  }

  useEffect(() => { loadLeads(); }, [filterStatus]);

  async function handleStatusChange(leadId: string, newStatus: string) {
    const result = await updateLeadStatus(leadId, newStatus);
    if (result.success) {
      toast.success('Status atualizado');
      loadLeads();
    } else {
      toast.error('Erro ao atualizar status');
    }
  }

  const columns = useMemo(() => makeColumns(handleStatusChange), []);

  const filtered = search
    ? leads.filter(
        (l) =>
          l.nome?.toLowerCase().includes(search.toLowerCase()) ||
          l.whatsapp?.includes(search) ||
          l.email?.toLowerCase().includes(search.toLowerCase())
      )
    : leads;

  const statusOptions = LEAD_STATUS.map((s) => ({
    value: s,
    label: statusConfig[s].label,
  }));

  if (loading && leads.length === 0) return <PageLoading text="Carregando leads..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="LEADS"
        description={`Gestão completa de leads — ${leads.length} registros`}
        actionLabel="Novo Lead"
        onAction={() => setDialogOpen(true)}
      />

      {/* Stats por status */}
      <StatsGrid cols={4}>
        {(['novo', 'contatado', 'negociacao', 'proposta_enviada'] as LeadStatus[]).map((status) => {
          const cfg = statusConfig[status];
          const count = leads.filter((l) => l.status === status).length;
          return (
            <StatsCard
              key={status}
              label={cfg.label}
              value={count}
              onClick={() => setFilterStatus(filterStatus === status ? '' : status)}
              active={filterStatus === status}
            />
          );
        })}
      </StatsGrid>

      {/* Busca + Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome, WhatsApp ou e-mail..."
        />
        <FilterSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={statusOptions}
          placeholder="Todos os status"
        />
      </div>

      {/* Tabela */}
      <DataTable
        data={filtered}
        columns={columns}
        loading={loading}
        rowKey={(row) => row.id}
        emptyIcon={Users}
        emptyTitle="Nenhum lead encontrado"
        emptyDescription="Cadastre um lead manualmente ou use o Scanner PDF"
        onRowClick={(lead) => {
          setSelectedLead(lead);
          setDrawerOpen(true);
        }}
      />

      {/* Modal Novo Lead */}
      <LeadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadLeads}
      />

      {/* Drawer Detalhes do Lead */}
      <LeadDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        lead={selectedLead}
      />
    </div>
  );
}
