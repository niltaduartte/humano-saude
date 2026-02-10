'use client';

import { useState, useEffect } from 'react';
import { User, Camera, Save, Mail, Phone, MapPin, Building, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAdminProfile, saveAdminProfile } from '@/app/actions/integrations';

export default function PerfilPage() {
  const [profile, setProfile] = useState({
    nome: 'Administrador',
    email: 'admin@humanosaude.com',
    telefone: '',
    cargo: 'Administrador',
    empresa: 'Humano Saúde',
    bio: '',
    creci: '',
    susep: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getAdminProfile();
      if (res.success && res.data) {
        setProfile((prev) => ({ ...prev, ...(res.data as typeof prev) }));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await saveAdminProfile(profile as unknown as Record<string, unknown>);
    setSaving(false);
    if (res.success) {
      toast.success('Perfil atualizado com sucesso');
    } else {
      toast.error('Erro ao salvar perfil', { description: res.error });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
            PERFIL
          </h1>
          <p className="mt-2 text-gray-400">Informações do seu perfil</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#F6E05E] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F6E05E] flex items-center justify-center">
              <User className="h-12 w-12 text-black" />
            </div>
            <button className="absolute bottom-0 right-0 rounded-full bg-[#D4AF37] p-1.5 text-black hover:bg-[#F6E05E] transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile.nome}</h2>
            <p className="text-sm text-gray-400">{profile.cargo} — {profile.empresa}</p>
            <p className="text-sm text-[#D4AF37] mt-1">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Informações Pessoais */}
      <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Informações Pessoais</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome Completo</label>
            <input
              type="text"
              value={profile.nome}
              onChange={(e) => setProfile({ ...profile, nome: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Telefone</label>
            <input
              type="tel"
              value={profile.telefone}
              onChange={(e) => setProfile({ ...profile, telefone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2 text-white placeholder-gray-600 focus:border-[#D4AF37]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Cargo</label>
            <input
              type="text"
              value={profile.cargo}
              onChange={(e) => setProfile({ ...profile, cargo: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Dados Profissionais */}
      <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Dados Profissionais</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Registro SUSEP</label>
            <input
              type="text"
              value={profile.susep}
              onChange={(e) => setProfile({ ...profile, susep: e.target.value })}
              placeholder="Número SUSEP"
              className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2 text-white placeholder-gray-600 focus:border-[#D4AF37]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">CRECI</label>
            <input
              type="text"
              value={profile.creci}
              onChange={(e) => setProfile({ ...profile, creci: e.target.value })}
              placeholder="Número CRECI"
              className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2 text-white placeholder-gray-600 focus:border-[#D4AF37]/50 focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm text-gray-400 mb-1">Bio / Apresentação</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Uma breve apresentação sobre você..."
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2 text-white placeholder-gray-600 focus:border-[#D4AF37]/50 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
