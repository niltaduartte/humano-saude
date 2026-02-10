"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Target,
  DollarSign,
  Receipt,
  CreditCard,
  Wallet,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Sparkles,
  Megaphone,
  BrainCircuit,
  Zap,
  UsersRound,
  FileText,
  Archive,
  ClipboardList,
  MessageSquare,
  Mail,
  Bell,
  Settings,
  User,
  Shield,
  Database,
  LogOut,
  HelpCircle,
  ChevronRight,
  X,
  Share2,
  MessagesSquare,
  Bot,
  Gauge
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Logo, { LogoIcon, LogoWithGradientText } from "./Logo"

// ============================================
// TIPOS
// ============================================

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: {
    text: string
    variant: "default" | "gold" | "success" | "danger" | "warning"
  }
  description?: string
}

interface MenuGroup {
  id: string
  title: string
  items: MenuItem[]
}

// ============================================
// CONSTANTE BASE - Rota do Portal Interno
// ============================================

const P = "/portal-interno-hks-2026"

// ============================================
// MENU ITEMS - 25 ITENS EM 8 GRUPOS
// ============================================

const menuGroups: MenuGroup[] = [
  // Grupo 1: Visão Geral
  {
    id: "visao-geral",
    title: "Visão Geral",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: P,
        description: "Visão geral dos KPIs"
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: TrendingUp,
        href: `${P}/analytics`,
        badge: { text: "GA4", variant: "gold" },
        description: "Google Analytics 4"
      },
      {
        id: "cockpit",
        label: "Cockpit",
        icon: Target,
        href: `${P}/cockpit`,
        description: "Painel de controle"
      }
    ]
  },

  // Grupo 2: Vendas & Finanças
  {
    id: "vendas-financas",
    title: "Vendas & Finanças",
    items: [
      {
        id: "leads",
        label: "Leads",
        icon: Users,
        href: `${P}/leads`,
        badge: { text: "12", variant: "danger" },
        description: "Gestão de leads"
      },
      {
        id: "cotacoes",
        label: "Cotações",
        icon: Receipt,
        href: `${P}/cotacoes`,
        description: "Cotações de seguros"
      },
      {
        id: "vendas",
        label: "Vendas",
        icon: DollarSign,
        href: `${P}/vendas`,
        description: "Pipeline de vendas"
      },
      {
        id: "faturamento",
        label: "Faturamento",
        icon: CreditCard,
        href: `${P}/faturamento`,
        description: "Receitas e comissões"
      },
      {
        id: "financeiro",
        label: "Financeiro",
        icon: Wallet,
        href: `${P}/financeiro`,
        description: "Gestão financeira"
      }
    ]
  },

  // Grupo 3: Análise
  {
    id: "analise",
    title: "Análise",
    items: [
      {
        id: "relatorios",
        label: "Relatórios",
        icon: BarChart3,
        href: `${P}/relatorios`,
        description: "Relatórios gerenciais"
      },
      {
        id: "metricas",
        label: "Métricas",
        icon: LineChart,
        href: `${P}/metricas`,
        description: "KPIs e indicadores"
      },
      {
        id: "funil",
        label: "Funil de Vendas",
        icon: PieChart,
        href: `${P}/funil`,
        description: "Análise do funil"
      },
      {
        id: "performance",
        label: "Performance",
        icon: Activity,
        href: `${P}/performance`,
        description: "Desempenho da equipe"
      }
    ]
  },

  // Grupo 4: IA & Anúncios
  {
    id: "ia-anuncios",
    title: "IA & Anúncios",
    items: [
      {
        id: "scanner-ia",
        label: "Scanner IA",
        icon: Sparkles,
        href: `${P}/scanner`,
        badge: { text: "Novo", variant: "gold" },
        description: "Extração de PDFs"
      },
      {
        id: "meta-ads",
        label: "Meta Ads",
        icon: Megaphone,
        href: `${P}/meta-ads`,
        description: "Campanhas Facebook/Instagram"
      },
      {
        id: "automacao",
        label: "Automação IA",
        icon: BrainCircuit,
        href: `${P}/automacao`,
        description: "Workflows inteligentes"
      },
      {
        id: "insights",
        label: "Insights IA",
        icon: Zap,
        href: `${P}/insights`,
        badge: { text: "Beta", variant: "warning" },
        description: "Análises preditivas"
      },
      {
        id: "regras-ia",
        label: "Regras IA",
        icon: Bot,
        href: `${P}/regras-ia`,
        description: "Regras de automação IA"
      },
      {
        id: "dashboard-ia",
        label: "Dashboard IA",
        icon: Gauge,
        href: `${P}/ai-performance/dashboard-ia`,
        badge: { text: "Novo", variant: "gold" },
        description: "Performance dos módulos IA"
      }
    ]
  },

  // Grupo 5: Gestão
  {
    id: "gestao",
    title: "Gestão",
    items: [
      {
        id: "clientes",
        label: "Clientes",
        icon: UsersRound,
        href: `${P}/clientes`,
        description: "Base de clientes"
      },
      {
        id: "contratos",
        label: "Contratos",
        icon: FileText,
        href: `${P}/contratos`,
        description: "Gestão de contratos"
      },
      {
        id: "documentos",
        label: "Documentos",
        icon: Archive,
        href: `${P}/documentos`,
        description: "Biblioteca de documentos"
      },
      {
        id: "tarefas",
        label: "Tarefas",
        icon: ClipboardList,
        href: `${P}/tarefas`,
        badge: { text: "5", variant: "warning" },
        description: "Gestão de tarefas"
      }
    ]
  },

  // Grupo 6: Comunicação
  {
    id: "comunicacao",
    title: "Comunicação",
    items: [
      {
        id: "whatsapp",
        label: "WhatsApp",
        icon: MessageSquare,
        href: `${P}/whatsapp`,
        badge: { text: "8", variant: "success" },
        description: "Mensagens WhatsApp"
      },
      {
        id: "email",
        label: "E-mail",
        icon: Mail,
        href: `${P}/email`,
        description: "Campanhas de e-mail"
      },
      {
        id: "notificacoes",
        label: "Notificações",
        icon: Bell,
        href: `${P}/notificacoes`,
        badge: { text: "3", variant: "danger" },
        description: "Central de notificações"
      },
      {
        id: "social",
        label: "Social Media",
        icon: Share2,
        href: `${P}/social`,
        description: "Gestão de redes sociais"
      },
      {
        id: "chat",
        label: "Chat Equipe",
        icon: MessagesSquare,
        href: `${P}/chat`,
        description: "Chat interno da equipe"
      }
    ]
  },

  // Grupo 7: Configuração
  {
    id: "configuracao",
    title: "Configuração",
    items: [
      {
        id: "configuracoes",
        label: "Configurações",
        icon: Settings,
        href: `${P}/configuracoes`,
        description: "Configurações do sistema"
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: User,
        href: `${P}/perfil`,
        description: "Meu perfil"
      },
      {
        id: "seguranca",
        label: "Segurança",
        icon: Shield,
        href: `${P}/seguranca`,
        description: "Segurança e privacidade"
      },
      {
        id: "integracao",
        label: "Integrações",
        icon: Database,
        href: `${P}/integracoes`,
        description: "APIs e integrações"
      }
    ]
  }
]

// Footer items (separados)
const footerItems: MenuItem[] = [
  {
    id: "ajuda",
    label: "Ajuda",
    icon: HelpCircle,
    href: "/ajuda",
    description: "Central de ajuda"
  },
  {
    id: "sair",
    label: "Sair",
    icon: LogOut,
    href: "/logout",
    description: "Encerrar sessão"
  }
]

// ============================================
// BADGE VARIANTS
// ============================================

const badgeVariants = {
  default: "bg-white/10 text-white",
  gold: "bg-gradient-to-r from-[#D4AF37] to-[#F6E05E] text-black",
  success: "bg-green-500/20 text-green-400",
  danger: "bg-red-500/20 text-red-400",
  warning: "bg-yellow-500/20 text-yellow-400"
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function DockSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // Mesmo se falhar, redireciona
    }
    router.push("/admin-login")
  }

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="hidden lg:flex fixed left-0 top-0 h-screen bg-[#050505]/95 backdrop-blur-xl border-r border-white/10 flex-col z-50"
      >
        {/* HEADER - Logo Oficial Humano Saúde */}
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center h-12"
              >
                <Logo variant="2" size="sm" className="max-w-[160px] max-h-[40px]" />
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center h-10 w-10"
              >
                <LogoIcon variant="2" size="sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MENU - Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 sidebar-scroll">
          <nav className="space-y-6">
            {menuGroups.map((group) => (
              <div key={group.id}>
                {/* Group Title */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 mb-2"
                    >
                      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                        {group.title}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Group Items */}
                <div className="space-y-1 px-2">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)

                    return (
                      <Link key={item.id} href={item.href}>
                        <motion.div
                          whileHover={{ x: isExpanded ? 4 : 0, scale: isExpanded ? 1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            active
                              ? "bg-gradient-to-r from-[#D4AF37]/20 to-[#F6E05E]/10 shadow-lg shadow-[#D4AF37]/20"
                              : "hover:bg-white/5"
                          )}
                        >
                          {/* Active Indicator */}
                          {active && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#D4AF37] to-[#F6E05E] rounded-r-full"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}

                          {/* Icon */}
                          <div className={cn(
                            "flex-shrink-0 transition-colors",
                            active
                              ? "text-[#D4AF37]"
                              : "text-white/60 group-hover:text-[#F6E05E]"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Label + Badge */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex-1 flex items-center justify-between min-w-0"
                              >
                                <span className={cn(
                                  "text-sm font-medium truncate transition-colors",
                                  active
                                    ? "text-white"
                                    : "text-white/80 group-hover:text-white"
                                )}>
                                  {item.label}
                                </span>

                                {item.badge && (
                                  <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                    badgeVariants[item.badge.variant]
                                  )}>
                                    {item.badge.text}
                                  </span>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Tooltip for collapsed state */}
                          {!isExpanded && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-[#050505] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                              <p className="text-sm font-medium text-white">{item.label}</p>
                              {item.description && (
                                <p className="text-xs text-white/60 mt-0.5">{item.description}</p>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-2 space-y-1">
          {footerItems.map((item) => {
            const Icon = item.icon
            const isLogout = item.id === "sair"

            const content = (
              <motion.div
                whileHover={{ x: isExpanded ? 4 : 0, scale: isExpanded ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex-shrink-0 text-white/60 group-hover:text-[#F6E05E] transition-colors">
                  <Icon className="h-5 w-5" />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium text-white/80 group-hover:text-white transition-colors"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-[#050505] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                    <p className="text-sm font-medium text-white">{item.label}</p>
                  </div>
                )}
              </motion.div>
            )

            if (isLogout) {
              return (
                <div key={item.id} onClick={handleLogout}>
                  {content}
                </div>
              )
            }

            return (
              <Link key={item.id} href={item.href}>
                {content}
              </Link>
            )
          })}
        </div>
      </motion.aside>

      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 h-14 w-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F6E05E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 z-50"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6 text-black" />
        ) : (
          <LayoutDashboard className="h-6 w-6 text-black" />
        )}
      </button>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-[#050505]/98 backdrop-blur-xl border-r border-white/10 flex flex-col z-50"
            >
              {/* Header - Logo Oficial Mobile */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 overflow-hidden">
                <Logo variant="2" size="sm" className="max-w-[140px] max-h-[36px]" />

                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5 text-white/60" />
                </button>
              </div>

              {/* Menu */}
              <div className="flex-1 overflow-y-auto py-4 sidebar-scroll">
                <nav className="space-y-6">
                  {menuGroups.map((group) => (
                    <div key={group.id}>
                      <div className="px-4 mb-2">
                        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                          {group.title}
                        </span>
                      </div>

                      <div className="space-y-1 px-2">
                        {group.items.map((item) => {
                          const Icon = item.icon
                          const active = isActive(item.href)

                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              onClick={() => setIsMobileOpen(false)}
                            >
                              <div className={cn(
                                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                                active
                                  ? "bg-gradient-to-r from-[#D4AF37]/20 to-[#F6E05E]/10"
                                  : "hover:bg-white/5"
                              )}>
                                {active && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#D4AF37] to-[#F6E05E] rounded-r-full" />
                                )}

                                <Icon className={cn(
                                  "h-5 w-5",
                                  active ? "text-[#D4AF37]" : "text-white/60"
                                )} />

                                <span className={cn(
                                  "text-sm font-medium flex-1",
                                  active ? "text-white" : "text-white/80"
                                )}>
                                  {item.label}
                                </span>

                                {item.badge && (
                                  <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                    badgeVariants[item.badge.variant]
                                  )}>
                                    {item.badge.text}
                                  </span>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-2 space-y-1">
                {footerItems.map((item) => {
                  const Icon = item.icon
                  const isLogout = item.id === "sair"

                  const content = (
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <Icon className="h-5 w-5 text-white/60" />
                      <span className="text-sm font-medium text-white/80">
                        {item.label}
                      </span>
                    </div>
                  )

                  if (isLogout) {
                    return (
                      <div key={item.id} onClick={() => { setIsMobileOpen(false); handleLogout() }}>
                        {content}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {content}
                    </Link>
                  )
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
