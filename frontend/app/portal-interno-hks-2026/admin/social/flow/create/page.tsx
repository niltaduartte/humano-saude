'use client';

import { Image, Video, FileText, Send } from 'lucide-react';

export default function CreatePostPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CRIAR POST
        </h1>
        <p className="mt-2 text-gray-400">Crie e agende posts para todas as redes sociais</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Editor */}
        <div className="space-y-6">
          <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Conteúdo do Post</h3>
            <textarea
              rows={8}
              placeholder="O que você quer compartilhar?"
              className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
            />
            
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2">
                <Image className="h-4 w-4" />
                Imagem
              </button>
              <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2">
                <Video className="h-4 w-4" />
                Vídeo
              </button>
              <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documento
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Seleção de Plataformas</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Facebook', icon: '📘', enabled: true },
                { name: 'Instagram', icon: '📷', enabled: true },
                { name: 'LinkedIn', icon: '💼', enabled: false },
                { name: 'Twitter', icon: '🐦', enabled: false },
              ].map((platform, i) => (
                <label key={i} className="flex items-center justify-between p-4 rounded-lg bg-[#151515] border border-[#D4AF37]/10 cursor-pointer hover:border-[#D4AF37]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <span className="text-white font-semibold">{platform.name}</span>
                  </div>
                  <input type="checkbox" defaultChecked={platform.enabled} className="h-5 w-5" />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Schedule */}
        <div className="space-y-6">
          <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Preview</h3>
            <div className="rounded-lg bg-[#151515] p-4 min-h-[200px] border border-[#D4AF37]/10">
              <p className="text-gray-400 text-sm text-center">Seu post aparecerá aqui</p>
            </div>
          </div>

          <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
            <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Agendamento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Data</label>
                <input type="date" className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Horário</label>
                <input type="time" className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors flex items-center justify-center gap-2">
              <Send className="h-5 w-5" />
              Agendar Post
            </button>
            <button className="w-full px-6 py-3 rounded-lg border border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 transition-colors">
              Salvar como Rascunho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
