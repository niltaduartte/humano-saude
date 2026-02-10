'use client';

import { useState } from 'react';
import {
  Instagram, Facebook, Linkedin, Calendar, PenSquare,
  Heart, MessageCircle, Share2, Eye, Clock, CheckCircle,
} from 'lucide-react';

type Post = {
  id: number;
  plataforma: 'instagram' | 'facebook' | 'linkedin';
  tipo: string;
  titulo: string;
  status: 'publicado' | 'agendado' | 'rascunho';
  data: string;
  curtidas: number;
  comentarios: number;
  compartilhamentos: number;
  alcance: number;
};

const POSTS: Post[] = [
  { id: 1, plataforma: 'instagram', tipo: 'carrossel', titulo: 'Top 5 dicas para escolher o melhor plano de saúde', status: 'publicado', data: '2026-02-10', curtidas: 342, comentarios: 28, compartilhamentos: 47, alcance: 4850 },
  { id: 2, plataforma: 'facebook', tipo: 'video', titulo: 'Como funciona a portabilidade de plano?', status: 'publicado', data: '2026-02-09', curtidas: 189, comentarios: 15, compartilhamentos: 32, alcance: 3200 },
  { id: 3, plataforma: 'linkedin', tipo: 'artigo', titulo: 'ANS aprova novo regulamento para planos empresariais', status: 'publicado', data: '2026-02-08', curtidas: 97, comentarios: 12, compartilhamentos: 21, alcance: 1850 },
  { id: 4, plataforma: 'instagram', tipo: 'story', titulo: 'Bastidores: dia a dia na Humano Saúde', status: 'agendado', data: '2026-02-11', curtidas: 0, comentarios: 0, compartilhamentos: 0, alcance: 0 },
  { id: 5, plataforma: 'facebook', tipo: 'imagem', titulo: 'Promoção Plano Familiar - Fevereiro', status: 'rascunho', data: '', curtidas: 0, comentarios: 0, compartilhamentos: 0, alcance: 0 },
];

function PlatformIcon({ p }: { p: string }) {
  if (p === 'instagram') return <Instagram className="h-4 w-4 text-pink-400" />;
  if (p === 'facebook') return <Facebook className="h-4 w-4 text-blue-400" />;
  if (p === 'linkedin') return <Linkedin className="h-4 w-4 text-sky-400" />;
  return null;
}

export default function SocialPage() {
  const [tab, setTab] = useState<'todos' | 'publicado' | 'agendado' | 'rascunho'>('todos');
  const filtered = tab === 'todos' ? POSTS : POSTS.filter((p) => p.status === tab);
  const pub = POSTS.filter((p) => p.status === 'publicado');
  const totalAlcance = pub.reduce((s, p) => s + p.alcance, 0);
  const totalEng = pub.reduce((s, p) => s + p.curtidas + p.comentarios + p.compartilhamentos, 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          SOCIAL MEDIA
        </h1>
        <p className="mt-2 text-gray-400">Gestão de redes sociais e calendário de publicações</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Publicados', value: pub.length, icon: CheckCircle, color: 'text-green-400', border: 'border-green-500/20' },
          { label: 'Agendados', value: POSTS.filter((p) => p.status === 'agendado').length, icon: Clock, color: 'text-yellow-400', border: 'border-yellow-500/20' },
          { label: 'Alcance Total', value: totalAlcance.toLocaleString('pt-BR'), icon: Eye, color: 'text-blue-400', border: 'border-blue-500/20' },
          { label: 'Engajamento', value: totalEng.toLocaleString('pt-BR'), icon: Heart, color: 'text-pink-400', border: 'border-pink-500/20' },
        ].map((item, i) => (
          <div key={i} className={`rounded-lg border ${item.border} bg-[#0a0a0a] p-5`}>
            <item.icon className={`h-6 w-6 ${item.color} mb-3`} />
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="text-xs text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Calendário 7 dias */}
      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Próximos 7 Dias
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = new Date();
            day.setDate(day.getDate() + i);
            const ds = day.toISOString().split('T')[0];
            const dp = POSTS.filter((p) => p.data === ds);
            return (
              <div key={i} className={`rounded-lg border p-3 text-center ${
                dp.length > 0 ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5' : 'border-white/10'
              }`}>
                <p className="text-xs text-gray-500">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                <p className="text-lg font-bold text-white">{day.getDate()}</p>
                {dp.length > 0 && (
                  <div className="mt-1 flex justify-center gap-1">
                    {dp.map((p) => <PlatformIcon key={p.id} p={p.plataforma} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros + Lista de posts */}
      <div className="rounded-lg border border-white/10 bg-[#0a0a0a]">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex gap-2">
            {(['todos', 'publicado', 'agendado', 'rascunho'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === t ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t === 'todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
              </button>
            ))}
          </div>
          <button className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#F6E05E] transition-colors flex items-center gap-2">
            <PenSquare className="h-4 w-4" /> Criar Post
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">Nenhum post encontrado</div>
          ) : (
            filtered.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 hover:bg-[#151515] transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <PlatformIcon p={post.plataforma} />
                    <span className="text-xs text-gray-500 uppercase">{post.tipo}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{post.titulo}</p>
                    <p className="text-xs text-gray-500">
                      {post.data ? new Date(post.data + 'T12:00:00').toLocaleDateString('pt-BR') : 'Sem data'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {post.status === 'publicado' && (
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span><Heart className="inline h-3 w-3 mr-0.5" />{post.curtidas}</span>
                      <span><MessageCircle className="inline h-3 w-3 mr-0.5" />{post.comentarios}</span>
                      <span><Share2 className="inline h-3 w-3 mr-0.5" />{post.compartilhamentos}</span>
                      <span><Eye className="inline h-3 w-3 mr-0.5" />{post.alcance.toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    post.status === 'publicado' ? 'bg-green-500/20 text-green-400' :
                    post.status === 'agendado' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {post.status === 'publicado' ? 'Publicado' : post.status === 'agendado' ? 'Agendado' : 'Rascunho'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
