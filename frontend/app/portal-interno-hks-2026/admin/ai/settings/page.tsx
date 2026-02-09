'use client';

import { Settings as SettingsIcon, Brain, Key, Zap } from 'lucide-react';

export default function AISettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CONFIGURAÇÕES IA
        </h1>
        <p className="mt-2 text-gray-400">Ajustes e preferências do sistema de inteligência artificial</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="text-lg font-semibold text-white">Modelo de IA</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Modelo OpenAI</label>
              <select className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white">
                <option>GPT-4 Turbo</option>
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Temperature</label>
              <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full" />
              <p className="text-xs text-gray-500 mt-1">Criatividade das respostas (0 = conservador, 1 = criativo)</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="text-lg font-semibold text-white">API Keys</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">OpenAI API Key</label>
              <input type="password" defaultValue="sk-..." className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Meta Ads Token</label>
              <input type="password" defaultValue="EAAx..." className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="text-lg font-semibold text-white">Automações</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Auto-scaling de campanhas', enabled: true },
              { label: 'Geração automática de audiences', enabled: true },
              { label: 'Otimização de criativos', enabled: false },
              { label: 'Resposta automática WhatsApp', enabled: true },
            ].map((auto, i) => (
              <label key={i} className="flex items-center justify-between cursor-pointer">
                <span className="text-white">{auto.label}</span>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" defaultChecked={auto.enabled} className="sr-only peer" />
                  <div className={`w-12 h-6 rounded-full transition-colors ${auto.enabled ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                    <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
                      auto.enabled ? 'translate-x-6 bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="text-lg font-semibold text-white">Preferências</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Idioma da IA</label>
              <select className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white">
                <option>Português (Brasil)</option>
                <option>English</option>
                <option>Español</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Tom de voz</label>
              <select className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white">
                <option>Profissional</option>
                <option>Amigável</option>
                <option>Formal</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button className="px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors">
        Salvar Configurações
      </button>
    </div>
  );
}
