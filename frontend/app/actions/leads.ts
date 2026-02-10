'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Tipo para os dados do lead vindos do backend Python
export type ScannedLeadData = {
  nome: string;
  whatsapp: string;
  email?: string;
  operadora_atual?: string;
  valor_atual?: number;
  idades: number[];
  economia_estimada?: number;
  valor_proposto?: number;
  tipo_contratacao?: string;
  dados_pdf?: any;
  observacoes?: string;
};

// Tipo para a resposta da função
export type SaveLeadResponse = {
  success: boolean;
  lead_id?: string;
  error?: string;
  message?: string;
};

/**
 * Server Action: Salva um lead escaneado pela IA no Supabase
 * 
 * @param leadData - Dados do lead retornados pelo backend Python
 * @returns Promise<SaveLeadResponse> - Resultado da operação
 */
export async function saveScannedLead(
  leadData: ScannedLeadData
): Promise<SaveLeadResponse> {
  try {
    // Validação básica
    if (!leadData.nome || !leadData.whatsapp) {
      return {
        success: false,
        error: 'validation_error',
        message: 'Nome e WhatsApp são obrigatórios'
      };
    }

    // Verifica se já existe um lead com esse WhatsApp
    const { data: existingLead } = await supabase
      .from('insurance_leads')
      .select('id, nome')
      .eq('whatsapp', leadData.whatsapp)
      .single();

    if (existingLead) {
      return {
        success: false,
        error: 'duplicate_lead',
        message: `Lead já existe: ${existingLead.nome}`,
        lead_id: existingLead.id
      };
    }

    // Prepara os dados para inserção
    const leadToInsert = {
      nome: leadData.nome,
      whatsapp: leadData.whatsapp,
      email: leadData.email || null,
      operadora_atual: leadData.operadora_atual || null,
      valor_atual: leadData.valor_atual || null,
      idades: leadData.idades,
      economia_estimada: leadData.economia_estimada || null,
      valor_proposto: leadData.valor_proposto || null,
      tipo_contratacao: leadData.tipo_contratacao || null,
      status: 'novo' as const,
      origem: 'scanner_pdf',
      prioridade: 'media',
      dados_pdf: leadData.dados_pdf || null,
      observacoes: leadData.observacoes || null,
      historico: [
        {
          timestamp: new Date().toISOString(),
          evento: 'lead_criado',
          origem: 'scanner_pdf',
          detalhes: 'Lead criado automaticamente pelo Scanner de PDF'
        }
      ],
      arquivado: false
    };

    // Insere o lead no Supabase
    const { data, error } = await supabase
      .from('insurance_leads')
      .insert(leadToInsert)
      .select('id')
      .single();

    if (error) {
      console.error('❌ Erro ao salvar lead no Supabase:', error);
      return {
        success: false,
        error: 'database_error',
        message: `Erro ao salvar no banco: ${error.message}`
      };
    }

    // Revalida o cache da página de leads
    revalidatePath('/portal-interno-hks-2026/leads');
    revalidatePath('/portal-interno-hks-2026');

    console.log('✅ Lead salvo com sucesso:', data.id);

    return {
      success: true,
      lead_id: data.id,
      message: 'Lead salvo com sucesso!'
    };

  } catch (error: any) {
    console.error('❌ Erro inesperado ao salvar lead:', error);
    return {
      success: false,
      error: 'unexpected_error',
      message: error?.message || 'Erro inesperado ao salvar lead'
    };
  }
}

/**
 * Server Action: Busca todos os leads do dashboard
 * 
 * @param filters - Filtros opcionais (status, limite, offset)
 * @returns Promise com array de leads
 */
export async function getLeads(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('insurance_leads')
      .select('*')
      .eq('arquivado', false)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Erro ao buscar leads:', error);
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: data || [] };

  } catch (error: any) {
    console.error('❌ Erro inesperado ao buscar leads:', error);
    return { success: false, data: [], error: error?.message };
  }
}

/**
 * Server Action: Atualiza o status de um lead
 * 
 * @param leadId - ID do lead
 * @param newStatus - Novo status
 * @param observacao - Observação opcional
 * @returns Promise<SaveLeadResponse>
 */
export async function updateLeadStatus(
  leadId: string,
  newStatus: string,
  observacao?: string
): Promise<SaveLeadResponse> {
  try {
    // Busca o lead atual
    const { data: currentLead, error: fetchError } = await supabase
      .from('insurance_leads')
      .select('status, historico')
      .eq('id', leadId)
      .single();

    if (fetchError || !currentLead) {
      return {
        success: false,
        error: 'not_found',
        message: 'Lead não encontrado'
      };
    }

    // Prepara o novo histórico
    const novoHistorico = [
      ...(currentLead.historico || []),
      {
        timestamp: new Date().toISOString(),
        evento: 'mudanca_status',
        status_anterior: currentLead.status,
        status_novo: newStatus,
        observacao: observacao || null
      }
    ];

    // Atualiza o lead
    const { error: updateError } = await supabase
      .from('insurance_leads')
      .update({
        status: newStatus,
        historico: novoHistorico
      })
      .eq('id', leadId);

    if (updateError) {
      console.error('❌ Erro ao atualizar status:', updateError);
      return {
        success: false,
        error: 'database_error',
        message: `Erro ao atualizar: ${updateError.message}`
      };
    }

    // Revalida o cache
    revalidatePath('/portal-interno-hks-2026/leads');
    revalidatePath('/portal-interno-hks-2026');

    return {
      success: true,
      lead_id: leadId,
      message: 'Status atualizado com sucesso!'
    };

  } catch (error: any) {
    console.error('❌ Erro ao atualizar status:', error);
    return {
      success: false,
      error: 'unexpected_error',
      message: error?.message || 'Erro inesperado'
    };
  }
}

/**
 * Server Action: Busca estatísticas do dashboard
 * 
 * @returns Promise com estatísticas
 */
export async function getDashboardStats() {
  try {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .single();

    if (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data };

  } catch (error: any) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return { success: false, data: null, error: error?.message };
  }
}
