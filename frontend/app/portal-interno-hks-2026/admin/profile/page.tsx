'use client';

import { User, Bell, Shield, Key } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          PERFIL
        </h1>
        <p className="mt-2 text-gray-400">
          Configurações da sua conta e preferências
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-3xl">
            HC
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Helcio Mattos</h2>
            <p className="text-gray-400">Administrador</p>
            <button className="mt-2 text-sm text-[#D4AF37] hover:text-[#F6E05E]">Alterar foto</button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Nome Completo</label>
            <input
              type="text"
              defaultValue="Helcio Mattos"
              className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Email</label>
            <input
              type="email"
              defaultValue="helcio@humanosaude.com.br"
              className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Telefone</label>
            <input
              type="tel"
              defaultValue="+55 11 99999-9999"
              className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Cargo</label>
            <input
              type="text"
              defaultValue="Administrador"
              className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Key className="h-8 w-8 text-[#D4AF37] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Senha</h3>
          <p className="text-sm text-gray-400 mb-4">Alterar senha de acesso</p>
          <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Alterar →</button>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Shield className="h-8 w-8 text-[#D4AF37] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">2FA</h3>
          <p className="text-sm text-gray-400 mb-4">Autenticação de dois fatores</p>
          <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Configurar →</button>
        </div>

        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <Bell className="h-8 w-8 text-[#D4AF37] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Notificações</h3>
          <p className="text-sm text-gray-400 mb-4">Gerenciar preferências</p>
          <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Configurar →</button>
        </div>
      </div>
    </div>
  );
}
