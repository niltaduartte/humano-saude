'use client';

import { Sliders, Plus } from 'lucide-react';

export default function RulesPage() {
  const rules = [
    { name: 'Pausar se CPL > R$ 40', condition: 'CPL maior que R$ 40.00', action: 'Pausar campanha', active: true },
    { name: 'Escalar se ROI > 300%', condition: 'ROI maior que 300%', action: 'Aumentar budget +20%', active: true },
    { name: 'Reduzir se CTR < 1%', condition: 'CTR menor que 1%', action: 'Reduzir budget -30%', active: false },
    { name: 'Notificar se leads < 50/dia', condition: 'Leads por dia menor que 50', action: 'Enviar notificação', active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4AF37]/20 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Perpetua Titling MT, serif' }}>
          REGRAS DE AUTOMAÇÃO
        </h1>
        <p className="mt-2 text-gray-400">Configure regras personalizadas para automação inteligente</p>
      </div>

      <button className="px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#F6E05E] transition-colors flex items-center gap-2">
        <Plus className="h-5 w-5" />
        Nova Regra
      </button>

      <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#D4AF37]">Regras Ativas</h3>
        </div>

        <div className="divide-y divide-[#D4AF37]/10">
          {rules.map((rule, i) => (
            <div key={i} className="p-6 flex justify-between items-center hover:bg-[#151515] transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <Sliders className="h-6 w-6 text-[#D4AF37]" />
                <div>
                  <h4 className="font-semibold text-white mb-1">{rule.name}</h4>
                  <p className="text-sm text-gray-400">Se <strong>{rule.condition}</strong> então <strong className="text-[#D4AF37]">{rule.action}</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="relative inline-block w-12 h-6 cursor-pointer">
                  <input type="checkbox" defaultChecked={rule.active} className="sr-only peer" />
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    rule.active ? 'bg-green-500/20' : 'bg-gray-700'
                  }`}>
                    <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
                      rule.active ? 'translate-x-6 bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                </label>
                <button className="text-sm text-[#D4AF37] hover:text-[#F6E05E]">Editar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
