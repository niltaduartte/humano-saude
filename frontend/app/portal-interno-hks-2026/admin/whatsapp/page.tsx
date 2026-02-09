'use client';

import { MessageCircle, Send, PhoneCall, CheckCheck } from 'lucide-react';

export default function WhatsAppPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          WHATSAPP
        </h1>
        <p className="mt-2 text-gray-400">
          Central de atendimento via WhatsApp Business
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-6">
          <MessageCircle className="h-8 w-8 text-[#D4AF37] mb-4" />
          <p className="text-3xl font-bold text-white">1.247</p>
          <p className="mt-1 text-sm text-gray-400">Contatos ativos</p>
        </div>

        <div className="rounded-lg border border-green-500/20 bg-[#0a0a0a] p-6">
          <Send className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-3xl font-bold text-white">8.432</p>
          <p className="mt-1 text-sm text-gray-400">Mensagens enviadas</p>
        </div>

        <div className="rounded-lg border border-blue-500/20 bg-[#0a0a0a] p-6">
          <CheckCheck className="h-8 w-8 text-blue-500 mb-4" />
          <p className="text-3xl font-bold text-white">94.2%</p>
          <p className="mt-1 text-sm text-gray-400">Taxa de leitura</p>
        </div>

        <div className="rounded-lg border border-purple-500/20 bg-[#0a0a0a] p-6">
          <PhoneCall className="h-8 w-8 text-purple-500 mb-4" />
          <p className="text-3xl font-bold text-white">2.1 min</p>
          <p className="mt-1 text-sm text-gray-400">Tempo médio resposta</p>
        </div>
      </div>

      {/* WhatsApp Interface */}
      <div className="grid lg:grid-cols-[350px_1fr] gap-6">
        {/* Contacts List */}
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] h-[600px] flex flex-col">
          <div className="p-4 border-b border-[#D4AF37]/20">
            <input
              type="text"
              placeholder="Buscar conversas..."
              className="w-full rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="p-4 border-b border-[#D4AF37]/10 hover:bg-[#151515] cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                    C{i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-white truncate">Cliente {i}</p>
                      <span className="text-xs text-gray-500">10:{i}0</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">Última mensagem enviada...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#D4AF37]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                C1
              </div>
              <div>
                <p className="font-semibold text-white">Cliente 1</p>
                <p className="text-xs text-green-500">● Online</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors text-sm">
              Ver perfil
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-lg bg-[#151515] p-3">
                <p className="text-sm text-gray-300">Olá, gostaria de um orçamento para plano de saúde</p>
                <p className="text-xs text-gray-500 mt-1">10:15</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[70%] rounded-lg bg-[#D4AF37]/20 p-3">
                <p className="text-sm text-gray-300">Olá! Claro, posso ajudar. Quantas pessoas serão cobertas?</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 justify-end">
                  10:16 <CheckCheck className="h-3 w-3 text-blue-500" />
                </p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#D4AF37]/20">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
              />
              <button className="px-6 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
