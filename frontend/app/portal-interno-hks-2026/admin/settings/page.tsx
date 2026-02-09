'use client';

import { Settings as SettingsIcon, Palette, Globe, Database, Zap } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CONFIGURAÇÕES
        </h1>
        <p className="mt-2 text-gray-400">
          Configurações gerais do sistema e integrações
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Palette className="h-8 w-8 text-[#D4AF37] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Aparência</h3>
          <p className="text-sm text-gray-400 mb-4">Tema, cores e tipografia</p>
          <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Configurar →</button>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Globe className="h-8 w-8 text-[#D4AF37] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Regional</h3>
          <p className="text-sm text-gray-400 mb-4">Idioma, fuso horário e moeda</p>
          <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Configurar →</button>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Database className="h-8 w-8 text-[#D4AF37] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Banco de Dados</h3>
          <p className="text-sm text-gray-400 mb-4">Backup e sincronização</p>
          <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Configurar →</button>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Zap className="h-8 w-8 text-[#D4AF37] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Integrações</h3>
          <p className="text-sm text-gray-400 mb-4">APIs e webhooks</p>
          <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Configurar →</button>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <SettingsIcon className="h-8 w-8 text-[#D4AF37] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Sistema</h3>
          <p className="text-sm text-gray-400 mb-4">Configurações avançadas</p>
          <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Configurar →</button>
        </div>
      </div>

      {/* System Info */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-8">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Informações do Sistema</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Versão</span>
            <span className="text-white font-semibold">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Ambiente</span>
            <span className="text-white font-semibold">Produção</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Última atualização</span>
            <span className="text-white font-semibold">09/02/2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500">
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
