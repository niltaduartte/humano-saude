'use client';

import { Webhook, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          WEBHOOKS
        </h1>
        <p className="mt-2 text-gray-400">
          Gerenciamento de webhooks e eventos do sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Activity className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">12.847</p>
          <p className="mt-1 text-sm text-gray-400">Total eventos</p>
        </div>

        <div className="rounded-lg border border-green-500/20 bg-[#0a0a0a] p-6">
          <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-3xl font-bold text-white">12.543</p>
          <p className="mt-1 text-sm text-gray-400">Sucesso</p>
        </div>

        <div className="rounded-lg border border-red-500/20 bg-[#0a0a0a] p-6">
          <XCircle className="h-8 w-8 text-red-500 mb-4" />
          <p className="text-3xl font-bold text-white">247</p>
          <p className="mt-1 text-sm text-gray-400">Erros</p>
        </div>

        <div className="rounded-lg border border-yellow-500/20 bg-[#0a0a0a] p-6">
          <Clock className="h-8 w-8 text-yellow-500 mb-4" />
          <p className="text-3xl font-bold text-white">57</p>
          <p className="mt-1 text-sm text-gray-400">Pendentes</p>
        </div>
      </div>

      {/* Webhooks List */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Webhooks Configurados</h3>
          <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors text-sm">
            Adicionar Webhook
          </button>
        </div>
        <div className="divide-y divide-[#D4AF37]/10">
          {[
            { name: 'Meta Ads - Leads', url: 'https://api.humanosaude.com.br/webhooks/meta-leads', status: 'active' },
            { name: 'WhatsApp - Mensagens', url: 'https://api.humanosaude.com.br/webhooks/whatsapp', status: 'active' },
            { name: 'Supabase - Database Changes', url: 'https://api.humanosaude.com.br/webhooks/supabase', status: 'error' },
          ].map((webhook, i) => (
            <div key={i} className="p-6 hover:bg-[#151515] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Webhook className="h-5 w-5 text-[#D4AF37]" />
                  <h4 className="font-semibold text-white">{webhook.name}</h4>
                </div>
                {webhook.status === 'active' ? (
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500">
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-500">
                    Erro
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 font-mono">{webhook.url}</p>
              <div className="mt-3 flex gap-3">
                <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Editar</button>
                <button className="text-sm text-gray-400 hover:text-white">Testar</button>
                <button className="text-sm text-gray-400 hover:text-white">Logs</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Eventos Recentes</h3>
        </div>
        <div className="divide-y divide-[#D4AF37]/10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-[#151515] transition-colors">
              <div>
                <p className="font-semibold text-white">lead.created</p>
                <p className="text-sm text-gray-400">Meta Ads - Leads • Há {i} minutos</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
