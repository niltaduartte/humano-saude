// =====================================================
// API: /api/ads/cockpit — Dashboard Cockpit
// Retorna visão completa: métricas + campanhas ativas
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { getMarketingInsights } from '@/lib/meta-marketing';
import { isMetaConfigured, getMetaConfig, getCampaigns } from '@/lib/ads/meta-client';
import type { MetaDatePreset } from '@/lib/ads/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!isMetaConfigured()) {
      return NextResponse.json(
        { error: 'Meta Ads não configurado' },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const datePreset = (searchParams.get('period') || 'last_7d') as MetaDatePreset;

    const config = getMetaConfig();

    // Buscar em paralelo
    const [insightsResult, activeCampaigns] = await Promise.all([
      getMarketingInsights(datePreset),
      getCampaigns(config.adAccountId, 'ACTIVE').catch(() => []),
    ]);

    const { metrics, campaigns: campaignInsights } = insightsResult;

    // Calcular alertas
    const alerts: Array<{ type: 'warning' | 'error' | 'info'; message: string }> = [];

    if (metrics.totalSpend > 0 && metrics.totalPurchases === 0) {
      alerts.push({
        type: 'warning',
        message: `R$${metrics.totalSpend.toFixed(2)} gastos sem conversões no período`,
      });
    }

    if (metrics.cpa > 100) {
      alerts.push({
        type: 'warning',
        message: `CPA alto: R$${metrics.cpa.toFixed(2)} (meta: < R$100)`,
      });
    }

    if (metrics.roas > 0 && metrics.roas < 1) {
      alerts.push({
        type: 'error',
        message: `ROAS negativo: ${metrics.roas.toFixed(2)}x`,
      });
    }

    if (metrics.roas >= 3) {
      alerts.push({
        type: 'info',
        message: `ROAS excelente: ${metrics.roas.toFixed(2)}x 🎯`,
      });
    }

    return NextResponse.json({
      success: true,
      period: datePreset,
      metrics,
      activeCampaigns: {
        total: Array.isArray(activeCampaigns) ? activeCampaigns.length : 0,
        list: activeCampaigns,
      },
      campaignInsights: campaignInsights.slice(0, 10), // top 10
      alerts,
      config: {
        pixelConfigured: !!config.pixelId,
        pageConfigured: !!config.pageId,
        instagramConfigured: !!config.instagramId,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Erro no cockpit:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    );
  }
}
