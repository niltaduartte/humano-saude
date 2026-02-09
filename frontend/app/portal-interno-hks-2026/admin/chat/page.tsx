'use client';

import { MessageSquare, Send, Bot, User } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          CHAT IA
        </h1>
        <p className="mt-2 text-gray-400">
          Conversas inteligentes com atendimento automatizado
        </p>
      </div>

      {/* Chat Interface */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar - Lista de conversas */}
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-4">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Conversas Ativas</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-[#151515] hover:bg-[#1a1a1a] cursor-pointer transition-colors border border-[#D4AF37]/10">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-[#D4AF37]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Cliente {i}</p>
                    <p className="text-xs text-gray-500 truncate">Última mensagem...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] flex flex-col h-[600px]">
          <div className="p-4 border-b border-[#D4AF37]/20">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-[#D4AF37]" />
              <h3 className="text-lg font-semibold text-white">Assistente IA</h3>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-start gap-3 mb-4">
              <Bot className="h-8 w-8 text-[#D4AF37] mt-1" />
              <div className="rounded-lg bg-[#151515] p-3 max-w-md">
                <p className="text-sm text-gray-300">Olá! Como posso ajudar você hoje?</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[#D4AF37]/20">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 rounded-lg bg-[#151515] border border-[#D4AF37]/20 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
              />
              <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
