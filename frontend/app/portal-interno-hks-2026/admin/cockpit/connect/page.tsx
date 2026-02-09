'use client';

import { Plug, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ConnectPage() {
  const integrations = [
    { name: 'Meta Ads', status: 'connected', icon: '🎯', lastSync: 'Há 5 min' },
    { name: 'WhatsApp Business', status: 'connected', icon: '💬', lastSync: 'Há 2 min' },
    { name: 'Google Analytics', status: 'pending', icon: '📊', lastSync: 'Nunca' },
    { name: 'OpenAI GPT-4', status: 'connected', icon: '🤖', lastSync: 'Há 1 min' },
    { name: 'Supabase', status: 'connected', icon: '🗄️', lastSync: 'Em tempo real' },
    { name: 'SendGrid', status: 'error', icon: '📧', lastSync: 'Há 1 hora' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CONNECT
        </h1>
        <p className="mt-2 text-gray-400">
          Gerenciamento de integrações e APIs conectadas
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-green-500/20 bg-[#0a0a0a] p-6">
          <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-3xl font-bold text-white">4</p>
          <p className="mt-1 text-sm text-gray-400">Conectadas</p>
        </div>

        <div className="rounded-lg border border-yellow-500/20 bg-[#0a0a0a] p-6">
          <AlertCircle className="h-8 w-8 text-yellow-500 mb-4" />
          <p className="text-3xl font-bold text-white">1</p>
          <p className="mt-1 text-sm text-gray-400">Pendentes</p>
        </div>

        <div className="rounded-lg border border-red-500/20 bg-[#0a0a0a] p-6">
          <XCircle className="h-8 w-8 text-red-500 mb-4" />
          <p className="text-3xl font-bold text-white">1</p>
          <p className="mt-1 text-sm text-gray-400">Com Erro</p>
        </div>
      </div>

      {/* Integrations List */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Integrações Disponíveis</h3>
        </div>
        <div className="divide-y divide-[#D4AF37]/10">
          {integrations.map((integration, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-[#151515] transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <p className="font-semibold text-white">{integration.name}</p>
                  <p className="text-sm text-gray-400">Última sincronização: {integration.lastSync}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getStatusIcon(integration.status)}
                <button className="px-4 py-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors text-sm font-semibold">
                  Configurar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
