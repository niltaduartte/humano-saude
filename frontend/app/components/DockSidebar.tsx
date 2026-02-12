"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  ChevronDown,
  X,
  LogOut,
  HelpCircle,
  Crosshair,
  BarChart3,
  BrainCircuit,
  Gauge,
  Scale,
  ShieldAlert,
  UsersRound,
  Settings,
  Sparkles,
  ShoppingCart,
  LifeBuoy,
  Activity,
  Link2,
  MessageSquare,
  Route,
  Radar,
  Webhook,
  Wrench,
  Megaphone,
  Calendar,
  Image,
  LineChart,
  Mail,
  Users,
  Package,
  Ticket,
  CreditCard,
  FileText,
  Eye,
  Palette,
  Zap,
  Clock,
  PieChart,
  DollarSign,
  MessagesSquare,
  Cog,
  User,
  Shield,
  Database,
  Bell,
  Send,
  // Novos ícones para itens restaurados
  Brain,
  Lightbulb,
  ScanLine,
  CheckSquare,
  FileArchive,
  Wallet,
  Receipt,
  Award,
  Phone,
  Plug,
  Filter,
  UserPlus,
  Loader2,
  CheckCircle,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Logo, { LogoIcon } from "./Logo"

// ============================================
// TIPOS
// ============================================

interface SubItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: { text: string; variant: BadgeVariant }
}

type BadgeVariant = "default" | "gold" | "success" | "danger" | "warning" | "blue" | "green"

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  badge?: { text: string; variant: BadgeVariant }
  color?: "blue" | "green" | "gold"
  children?: SubItem[]
}

// ============================================
// CONSTANTE BASE
// ============================================

const P = "/portal-interno-hks-2026"

// ============================================
// MENU — MATCHING EXATO DO DESIGN (IMAGENS)
// ============================================

const sidebarItems: SidebarItem[] = [
  // ── VISÃO GERAL ──
  {
    id: "visao-geral",
    label: "Visão Geral",
    icon: LayoutDashboard,
    href: P,
    color: "green",
  },

  // ── ANALYTICS & COCKPIT ──
  {
    id: "analytics-hub",
    label: "Analytics",
    icon: TrendingUp,
    children: [
      { id: "analytics-ga4", label: "Google Analytics", icon: TrendingUp, href: `${P}/analytics`, badge: { text: "GA4", variant: "danger" } },
      { id: "analytics-metricas", label: "Métricas & KPIs", icon: LineChart, href: `${P}/metricas`, badge: { text: "NOVO", variant: "gold" } },
      { id: "analytics-performance", label: "Performance", icon: Award, href: `${P}/performance` },
      { id: "analytics-relatorios", label: "Relatórios", icon: BarChart3, href: `${P}/relatorios` },
    ],
  },
  {
    id: "cockpit",
    label: "Cockpit",
    icon: Target,
    children: [
      { id: "cockpit-principal", label: "Painel de Controle", icon: Gauge, href: `${P}/cockpit` },
      { id: "cockpit-campanhas", label: "Campanhas", icon: Crosshair, href: `${P}/cockpit/campanhas` },
      { id: "cockpit-consolidado", label: "Consolidado", icon: BarChart3, href: `${P}/cockpit/consolidado`, badge: { text: "NOVO", variant: "danger" } },
    ],
  },

  // ── FUNIL & VENDAS ──
  {
    id: "funil-vendas",
    label: "Funil de Vendas",
    icon: Filter,
    color: "gold",
    children: [
      { id: "funil-pipeline", label: "Pipeline Visual", icon: Filter, href: `${P}/funil`, badge: { text: "🔥", variant: "gold" } },
      { id: "funil-leads", label: "Leads (CRM)", icon: Users, href: `${P}/leads`, badge: { text: "12", variant: "danger" } },
      { id: "funil-cotacoes", label: "Cotações", icon: Receipt, href: `${P}/cotacoes` },
      { id: "funil-vendas-page", label: "Vendas", icon: DollarSign, href: `${P}/vendas` },
      { id: "funil-contratos", label: "Contratos", icon: FileText, href: `${P}/contratos` },
    ],
  },

  // ── IA & INTELIGÊNCIA ──
  {
    id: "ia-hub",
    label: "Inteligência IA",
    icon: BrainCircuit,
    color: "gold",
    children: [
      { id: "ia-dashboard", label: "Dashboard IA", icon: Gauge, href: `${P}/ai-performance/dashboard-ia` },
      { id: "ia-insights", label: "Insights Preditivos", icon: Lightbulb, href: `${P}/insights`, badge: { text: "Beta", variant: "warning" } },
      { id: "ia-scanner", label: "Scanner PDF", icon: ScanLine, href: `${P}/scanner`, badge: { text: "IA", variant: "gold" } },
      { id: "ia-regras", label: "Regras de IA", icon: Brain, href: `${P}/regras-ia` },
      { id: "ia-escala", label: "Escala Automática", icon: Scale, href: `${P}/ai-performance/escala-automatica` },
      { id: "ia-alertas", label: "Regras de Alerta", icon: ShieldAlert, href: `${P}/ai-performance/regras-alerta` },
      { id: "ia-publicos", label: "Públicos IA", icon: UsersRound, href: `${P}/ai-performance/publicos` },
    ],
  },

  // ── META ADS ──
  {
    id: "meta-ads",
    label: "Meta Ads",
    icon: Megaphone,
    color: "blue",
    children: [
      { id: "meta-visao", label: "Visão Geral", icon: LayoutDashboard, href: `${P}/meta-ads` },
      { id: "meta-cockpit", label: "Cockpit Live", icon: Zap, href: `${P}/meta-ads/cockpit` },
      { id: "meta-lancamento", label: "Lançar Campanha", icon: Target, href: `${P}/meta-ads/lancamento` },
      { id: "meta-campanhas", label: "Campanhas", icon: Target, href: `${P}/meta-ads/campanhas` },
      { id: "meta-criativos", label: "Criativos", icon: Palette, href: `${P}/meta-ads/criativos` },
      { id: "meta-demografico", label: "Demográfico", icon: PieChart, href: `${P}/meta-ads/demografico` },
      { id: "meta-historico", label: "Histórico", icon: Clock, href: `${P}/meta-ads/historico` },
      { id: "meta-config", label: "Config. Meta", icon: Settings, href: `${P}/ai-performance/configuracoes-meta` },
    ],
  },

  // ── AUTOMAÇÃO ──
  {
    id: "automacao",
    label: "Automação",
    icon: Sparkles,
    children: [
      { id: "auto-central", label: "Central", icon: Sparkles, href: `${P}/automacao` },
      { id: "auto-carrinhos", label: "Carrinhos Abandonados", icon: ShoppingCart, href: `${P}/automacao/carrinhos-abandonados` },
      { id: "auto-sala", label: "Sala de Recuperação", icon: LifeBuoy, href: `${P}/automacao/sala-recuperacao` },
      { id: "auto-tracking", label: "Tracking Dashboard", icon: Activity, href: `${P}/automacao/tracking-dashboard` },
      { id: "auto-links", label: "Links Rastreáveis", icon: Link2, href: `${P}/automacao/links-rastreaveis` },
      { id: "auto-jornada", label: "Jornada de Compra", icon: Route, href: `${P}/automacao/jornada-compra` },
      { id: "auto-pixel", label: "Disparos de Pixel", icon: Radar, href: `${P}/automacao/disparos-pixel` },
      { id: "auto-webhooks", label: "Webhooks", icon: Webhook, href: `${P}/automacao/webhooks` },
    ],
  },

  // ── SOCIAL FLOW ──
  {
    id: "social-flow",
    label: "Social Flow",
    icon: Send,
    children: [
      { id: "sf-dashboard", label: "Dashboard", icon: LayoutDashboard, href: `${P}/social-flow` },
      { id: "sf-calendario", label: "Calendário", icon: Calendar, href: `${P}/social-flow/calendar` },
      { id: "sf-biblioteca", label: "Biblioteca", icon: Image, href: `${P}/social-flow/library` },
      { id: "sf-analytics", label: "Analytics", icon: LineChart, href: `${P}/social-flow/analytics` },
      { id: "sf-config", label: "Configurações", icon: Settings, href: `${P}/social-flow/settings` },
    ],
  },

  // ── CORRETORES (destaque) ──
  {
    id: "corretores",
    label: "Corretores",
    icon: Briefcase,
    href: `${P}/corretores`,
    color: "gold",
    badge: { text: "NOVO", variant: "gold" as BadgeVariant },
    children: [
      { id: "corretores-lista", label: "Solicitações", icon: UserPlus, href: `${P}/corretores` },
      { id: "corretores-convites", label: "Convites enviados", icon: Send, href: `${P}/corretores/convites` },
      { id: "corretores-indicacoes", label: "Indicações", icon: Award, href: `${P}/indicacoes` },
    ],
  },

  // ── GESTÃO & CLIENTES ──
  {
    id: "gestao",
    label: "Gestão",
    icon: UsersRound,
    children: [
      { id: "gestao-clientes", label: "Clientes", icon: Users, href: `${P}/clientes` },
      { id: "gestao-documentos", label: "Documentos", icon: FileArchive, href: `${P}/documentos` },
      { id: "gestao-tarefas", label: "Tarefas", icon: CheckSquare, href: `${P}/tarefas`, badge: { text: "5", variant: "warning" } },
    ],
  },

  // ── FINANCEIRO ──
  {
    id: "financeiro",
    label: "Financeiro",
    icon: Wallet,
    children: [
      { id: "fin-visao", label: "Visão Geral", icon: DollarSign, href: `${P}/financeiro` },
      { id: "fin-faturamento", label: "Faturamento", icon: CreditCard, href: `${P}/faturamento` },
    ],
  },

  // ── COMUNICAÇÃO ──
  {
    id: "comunicacao",
    label: "Comunicação",
    icon: MessagesSquare,
    color: "green",
    children: [
      { id: "com-whatsapp", label: "WhatsApp", icon: MessagesSquare, href: `${P}/whatsapp`, badge: { text: "8", variant: "success" } },
      { id: "com-chat", label: "Chat Equipe", icon: MessageSquare, href: `${P}/chat`, badge: { text: "NOVO", variant: "gold" } },
      { id: "com-email", label: "E-mail", icon: Mail, href: `${P}/email` },
      { id: "com-notificacoes", label: "Notificações", icon: Bell, href: `${P}/notificacoes`, badge: { text: "3", variant: "danger" } },
    ],
  },

  // ── CONFIGURAÇÕES ──
  {
    id: "configuracoes",
    label: "Configurações",
    icon: Cog,
    children: [
      { id: "config-geral", label: "Geral", icon: Settings, href: `${P}/configuracoes` },
      { id: "config-perfil", label: "Perfil", icon: User, href: `${P}/perfil` },
      { id: "config-seguranca", label: "Segurança", icon: Shield, href: `${P}/seguranca` },
      { id: "config-integracoes", label: "Integrações", icon: Plug, href: `${P}/integracoes` },
    ],
  },
]

// ============================================
// BADGE VARIANTS
// ============================================

const badgeStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-white",
  gold: "bg-gradient-to-r from-[#D4AF37] to-[#F6E05E] text-black",
  success: "bg-green-500/20 text-green-400",
  danger: "bg-red-500 text-white",
  warning: "bg-yellow-500/20 text-yellow-400",
  blue: "bg-blue-500/20 text-blue-400",
  green: "bg-green-500/20 text-green-400",
}

// Resolve cor de destaque por grupo
function resolveColors(item: SidebarItem, isHighlighted: boolean) {
  if (item.color === "blue") {
    return {
      parentBg: isHighlighted ? "bg-blue-600/15 border border-blue-500/30" : "border border-transparent hover:bg-white/5",
      icon: isHighlighted ? "text-blue-400" : "text-white/50",
      text: isHighlighted ? "text-blue-400" : "text-white/70",
      childActive: "bg-blue-600/15 text-blue-300",
    }
  }
  if (item.color === "green") {
    return {
      parentBg: isHighlighted ? "bg-green-600/15 border border-green-500/30" : "border border-transparent hover:bg-white/5",
      icon: isHighlighted ? "text-green-400" : "text-white/50",
      text: isHighlighted ? "text-green-400" : "text-white/70",
      childActive: "bg-green-600/15 text-green-300",
    }
  }
  if (item.color === "gold") {
    return {
      parentBg: isHighlighted ? "bg-[#D4AF37]/15 border border-[#D4AF37]/30" : "border border-transparent hover:bg-white/5",
      icon: isHighlighted ? "text-[#D4AF37]" : "text-white/50",
      text: isHighlighted ? "text-[#D4AF37]" : "text-white/70",
      childActive: "bg-[#D4AF37]/15 text-[#F4D03F]",
    }
  }
  return {
    parentBg: isHighlighted ? "bg-white/5 border border-transparent" : "border border-transparent hover:bg-white/5",
    icon: isHighlighted ? "text-white" : "text-white/50",
    text: isHighlighted ? "text-white" : "text-white/70",
    childActive: "bg-white/5 text-white",
  }
}

// ============================================
// COMPONENTE
// ============================================

export default function DockSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set())
  const [showConvite, setShowConvite] = useState(false)
  const [conviteEmail, setConviteEmail] = useState('')
  const [conviteLoading, setConviteLoading] = useState(false)
  const [conviteStatus, setConviteStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [conviteMsg, setConviteMsg] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => pathname === href
  const isChildActive = (item: SidebarItem) =>
    item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/")) ?? false

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }) } catch { /* redirect anyway */ }
    router.push("/admin-login")
  }

  const handleEnviarConvite = async () => {
    if (!conviteEmail.trim()) return
    setConviteLoading(true)
    setConviteStatus('idle')
    try {
      const res = await fetch('/api/corretor/convite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: conviteEmail.trim(), nomeConvidante: 'Humano Saúde' }),
      })
      const data = await res.json()
      if (data.success) {
        setConviteStatus('success')
        setConviteMsg('Convite enviado com sucesso!')
        setConviteEmail('')
        setTimeout(() => { setShowConvite(false); setConviteStatus('idle') }, 2500)
      } else {
        setConviteStatus('error')
        setConviteMsg(data.error || 'Erro ao enviar convite')
      }
    } catch {
      setConviteStatus('error')
      setConviteMsg('Erro de conexão')
    } finally {
      setConviteLoading(false)
    }
  }

  // Auto-abrir pai do item ativo
  const effectiveOpen = new Set(openMenus)
  sidebarItems.forEach((item) => {
    if (item.children && isChildActive(item)) effectiveOpen.add(item.id)
  })

  // ============================================
  // RENDER MENU ITEMS
  // ============================================

  const renderMenu = (expanded: boolean, onNav?: () => void) => (
    <nav className="space-y-0.5 px-2">
      {sidebarItems.map((item) => {
        const Icon = item.icon
        const hasChildren = !!item.children?.length
        const isOpen = effectiveOpen.has(item.id)
        const active = item.href ? isActive(item.href) : false
        const highlighted = active || (hasChildren && (isOpen || isChildActive(item)))
        const colors = resolveColors(item, highlighted)

        // Link direto (sem filhos)
        if (!hasChildren && item.href) {
          return (
            <Link key={item.id} href={item.href} onClick={onNav}>
              <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative", colors.parentBg)}>
                <Icon className={cn("h-5 w-5 flex-shrink-0", colors.icon)} />
                {expanded && (
                  <>
                    <span className={cn("text-sm font-medium flex-1 truncate", colors.text)}>{item.label}</span>
                    {item.badge && (
                      <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", badgeStyles[item.badge.variant])}>{item.badge.text}</span>
                    )}
                  </>
                )}
                {!expanded && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                    <p className="text-sm font-medium text-white">{item.label}</p>
                  </div>
                )}
              </div>
            </Link>
          )
        }

        // Accordion (com filhos)
        return (
          <div key={item.id}>
            <button
              onClick={() => expanded ? toggleMenu(item.id) : setIsExpanded(true)}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative", colors.parentBg)}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", colors.icon)} />
              {expanded && (
                <>
                  <span className={cn("text-sm font-medium flex-1 text-left truncate", colors.text)}>{item.label}</span>
                  {item.badge && (
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold mr-1", badgeStyles[item.badge.variant])}>{item.badge.text}</span>
                  )}
                  <ChevronDown className={cn("h-4 w-4 text-white/40 transition-transform duration-200", isOpen && "rotate-180")} />
                </>
              )}
              {!expanded && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{item.children?.length} sub-itens</p>
                </div>
              )}
            </button>

            <AnimatePresence>
              {isOpen && expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 pl-3 border-l border-white/10 mt-1 space-y-0.5">
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon
                      const childIsActive = isActive(child.href) || pathname.startsWith(child.href + "/")
                      return (
                        <Link key={child.id} href={child.href} onClick={onNav}>
                          <div className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                            childIsActive ? colors.childActive : "text-white/60 hover:text-white/80 hover:bg-white/5"
                          )}>
                            <ChildIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm truncate">{child.label}</span>
                            {child.badge && (
                              <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold ml-auto", badgeStyles[child.badge.variant])}>{child.badge.text}</span>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </nav>
  )

  // ============================================
  // FOOTER
  // ============================================

  const renderFooter = (expanded: boolean, onNav?: () => void) => (
    <div className="border-t border-white/10 p-2 space-y-1">
      <button
        onClick={() => { setShowConvite(true); onNav?.() }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#D4AF37]/10 transition-colors group relative"
      >
        <UserPlus className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
        {expanded && <span className="text-sm text-[#D4AF37] font-semibold">Convidar Corretor</span>}
        {!expanded && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
            <p className="text-sm font-medium text-[#D4AF37]">Convidar Corretor</p>
          </div>
        )}
      </button>
      <Link href="/ajuda" onClick={onNav}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group relative">
          <HelpCircle className="h-5 w-5 text-white/50 flex-shrink-0" />
          {expanded && <span className="text-sm text-white/70">Ajuda</span>}
          {!expanded && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
              <p className="text-sm text-white">Ajuda</p>
            </div>
          )}
        </div>
      </Link>
      <div
        onClick={() => { onNav?.(); handleLogout() }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group relative"
      >
        <LogOut className="h-5 w-5 text-white/50 flex-shrink-0" />
        {expanded && <span className="text-sm text-white/70">Sair</span>}
        {!expanded && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
            <p className="text-sm text-white">Sair</p>
          </div>
        )}
      </div>
    </div>
  )

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* DESKTOP */}
      <motion.aside
        initial={{ width: 72 }}
        animate={{ width: isExpanded ? 260 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="hidden lg:flex fixed left-0 top-0 h-screen bg-[#0B1215]/95 backdrop-blur-xl border-r border-white/10 flex-col z-50"
      >
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div key="full" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }} className="flex items-center justify-center h-10 w-full">
                <Logo variant="2" size="sm" className="max-w-[140px] max-h-[32px] [&_img]:max-h-[32px] [&_img]:w-auto" />
              </motion.div>
            ) : (
              <motion.div key="icon" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }} className="flex items-center justify-center h-8 w-8">
                <LogoIcon variant="2" size="sm" className="max-h-[28px] max-w-[28px] [&_img]:max-h-[28px] [&_img]:w-auto" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 sidebar-scroll">
          {renderMenu(isExpanded)}
        </div>
        {renderFooter(isExpanded)}
      </motion.aside>

      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 h-14 w-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F6E05E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 z-50"
      >
        {isMobileOpen ? <X className="h-6 w-6 text-black" /> : <LayoutDashboard className="h-6 w-6 text-black" />}
      </button>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-[#0B1215]/98 backdrop-blur-xl border-r border-white/10 flex flex-col z-50"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                <Logo variant="2" size="sm" className="max-w-[140px] max-h-[36px]" />
                <button onClick={() => setIsMobileOpen(false)} className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center">
                  <X className="h-5 w-5 text-white/60" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-3 sidebar-scroll">
                {renderMenu(true, () => setIsMobileOpen(false))}
              </div>
              {renderFooter(true, () => setIsMobileOpen(false))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MODAL CONVIDAR CORRETOR ── */}
      <AnimatePresence>
        {showConvite && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowConvite(false); setConviteStatus('idle') }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-[90vw] bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 z-[71]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Convidar Corretor</h3>
                    <p className="text-xs text-white/40">Envie um convite para novos corretores</p>
                  </div>
                </div>
                <button onClick={() => { setShowConvite(false); setConviteStatus('idle') }} className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center">
                  <X className="h-4 w-4 text-white/40" />
                </button>
              </div>

              {conviteStatus === 'success' ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-green-400">{conviteMsg}</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="text-xs text-white/50 mb-1.5 block font-medium">Email do futuro corretor</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="email"
                        value={conviteEmail}
                        onChange={(e) => setConviteEmail(e.target.value)}
                        placeholder="email@exemplo.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]/50"
                        onKeyDown={(e) => e.key === 'Enter' && handleEnviarConvite()}
                      />
                    </div>
                  </div>

                  {conviteStatus === 'error' && (
                    <p className="text-xs text-red-400 mb-3">{conviteMsg}</p>
                  )}

                  <button
                    onClick={handleEnviarConvite}
                    disabled={conviteLoading || !conviteEmail.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold text-sm hover:bg-[#F6E05E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {conviteLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar Convite
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-white/30 text-center mt-3">
                    O convidado receberá um email com o link da página Seja Corretor
                  </p>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
