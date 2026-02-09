'use client';

import { Settings as SettingsIcon, Link, Bell } from 'lucide-react';

export default function SocialSettingsPage() {
  const connectedAccounts = [
    { platform: 'Facebook', status: 'connected', icon: '📘' },
    { platform: 'Instagram', status: 'connected', icon: '📷' },
    { platform: 'LinkedIn', status: 'disconnected', icon: '💼' },
    { platform: 'Twitter', status: 'disconnected', icon: '🐦' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CONFIGURAÇÕES SOCIAL
        </h1>
        <p className="mt-2 text-gray-400">Gerencie contas e preferências de redes sociais</p>
      </div>

      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-6">Contas Conectadas</h3>
        <div className="space-y-4">
          {connectedAccounts.map((account, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-[#151515]">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{account.icon}</span>
                <div>
                  <p className="font-semibold text-white">{account.platform}</p>
                  <p className="text-sm text-gray-400">
                    {account.status === 'connected' ? '✅ Conectado' : '❌ Desconectado'}
                  </p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                account.status === 'connected'
                  ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                  : 'bg-[#D4AF37] text-black hover:bg-[#F6E05E]'
              } transition-colors`}>
                {account.status === 'connected' ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="text-lg font-semibold text-white">Notificações</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Novas menções', enabled: true },
              { label: 'Novos comentários', enabled: true },
              { label: 'Posts agendados', enabled: false },
              { label: 'Relatório semanal', enabled: true },
            ].map((notif, i) => (
              <label key={i} className="flex items-center justify-between cursor-pointer">
                <span className="text-white">{notif.label}</span>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                  <div className={`w-12 h-6 rounded-full transition-colors ${notif.enabled ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                    <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
                      notif.enabled ? 'translate-x-6 bg-green-500' : 'bg-gray-500'
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
              <label className="block text-sm font-semibold text-white mb-2">Horário padrão de posts</label>
              <input type="time" defaultValue="09:00" className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Fuso horário</label>
              <select className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white">
                <option>América/São Paulo (BRT)</option>
                <option>América/New York (EST)</option>
                <option>Europa/Lisboa (WET)</option>
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
