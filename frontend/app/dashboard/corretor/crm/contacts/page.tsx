'use client';

import { useCallback } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useCorretorId } from '../../hooks/useCorretorToken';
import { useCorretorContacts } from '../hooks/useCorretorCrm';
import { createContact, deleteContact } from '@/app/actions/crm';
import ContactsTable from '@/app/portal-interno-hks-2026/crm/components/ContactsTable';
import type { CrmContactFilters } from '@/lib/types/crm';

export default function CorretorContactsPage() {
  const corretorId = useCorretorId();
  const contacts = useCorretorContacts(corretorId || null);

  const handleNewContact = useCallback(async () => {
    if (!corretorId) return;
    const res = await createContact({
      company_id: null,
      lead_id: null,
      owner_corretor_id: corretorId,
      nome: 'Novo Contato',
      sobrenome: null,
      email: null,
      telefone: null,
      whatsapp: null,
      cpf: null,
      data_nascimento: null,
      cargo: null,
      lifecycle_stage: 'lead',
      lead_source: null,
      score: 0,
      score_motivo: null,
      ultimo_contato: null,
      total_atividades: 0,
      avatar_url: null,
      tags: [],
      custom_fields: {},
    });
    if (res.success) {
      toast.success('Contato criado!');
      contacts.refetch();
    } else {
      toast.error(res.error ?? 'Erro ao criar contato');
    }
  }, [corretorId, contacts]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Remover este contato?')) return;
    const res = await deleteContact(id);
    if (res.success) {
      toast.success('Contato removido');
      contacts.refetch();
    } else {
      toast.error(res.error ?? 'Erro ao remover');
    }
  }, [contacts]);

  const handleFilterChange = useCallback((partial: Partial<CrmContactFilters>) => {
    for (const [key, value] of Object.entries(partial)) {
      contacts.updateFilter(key as keyof CrmContactFilters, value);
    }
  }, [contacts]);

  if (!corretorId) return null;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-[#D4AF37]" />
            Meus <span className="text-[#D4AF37]">Contatos</span>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Gestão completa dos seus contatos no CRM
          </p>
        </div>
        <button
          onClick={handleNewContact}
          className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#F6E05E] transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Novo Contato
        </button>
      </div>

      {/* Table */}
      {contacts.result && (
        <ContactsTable
          contacts={contacts.result.data}
          loading={contacts.loading}
          total={contacts.result.total}
          page={contacts.result.page}
          perPage={contacts.result.perPage}
          filters={contacts.filters}
          onFilterChange={handleFilterChange}
          onPageChange={(p) => contacts.updateFilter('page', p)}
          onRowClick={() => {}}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
