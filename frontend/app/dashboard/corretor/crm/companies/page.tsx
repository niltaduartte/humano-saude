'use client';

import { useCallback } from 'react';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCorretorId } from '../../hooks/useCorretorToken';
import { useCorretorCompanies } from '../hooks/useCorretorCrm';
import { createCompany, deleteCompany } from '@/app/actions/crm';
import CompaniesTable from '@/app/portal-interno-hks-2026/crm/components/CompaniesTable';
import type { CrmCompanyFilters } from '@/lib/types/crm';

export default function CorretorCompaniesPage() {
  const corretorId = useCorretorId();
  const companies = useCorretorCompanies(corretorId || null);

  const handleNewCompany = useCallback(async () => {
    if (!corretorId) return;
    const res = await createCompany({
      nome: 'Nova Empresa',
      cnpj: null,
      razao_social: null,
      dominio: null,
      setor: null,
      porte: null,
      qtd_funcionarios: null,
      faturamento_anual: null,
      telefone: null,
      email: null,
      endereco: {},
      logo_url: null,
      tags: [],
      custom_fields: {},
      owner_corretor_id: corretorId,
    });
    if (res.success) {
      toast.success('Empresa criada!');
      companies.refetch();
    } else {
      toast.error(res.error ?? 'Erro ao criar empresa');
    }
  }, [corretorId, companies]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Remover esta empresa?')) return;
    const res = await deleteCompany(id);
    if (res.success) {
      toast.success('Empresa removida');
      companies.refetch();
    } else {
      toast.error(res.error ?? 'Erro ao remover');
    }
  }, [companies]);

  const handleFilterChange = useCallback((partial: Partial<CrmCompanyFilters>) => {
    for (const [key, value] of Object.entries(partial)) {
      companies.updateFilter(key as keyof CrmCompanyFilters, value);
    }
  }, [companies]);

  if (!corretorId) return null;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#D4AF37]" />
            Minhas <span className="text-[#D4AF37]">Empresas</span>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Gestão de contas corporativas e empresas vinculadas
          </p>
        </div>
        <button
          onClick={handleNewCompany}
          className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#F6E05E] transition-colors"
        >
          <Building2 className="h-4 w-4" />
          Nova Empresa
        </button>
      </div>

      {/* Table */}
      {companies.result && (
        <CompaniesTable
          companies={companies.result.data}
          loading={companies.loading}
          total={companies.result.total}
          page={companies.result.page}
          perPage={companies.result.perPage}
          filters={companies.filters}
          onFilterChange={handleFilterChange}
          onPageChange={(p) => companies.updateFilter('page', p)}
          onRowClick={() => {}}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
