// =====================================================
// API — /api/analytics/realtime
// GA4 Realtime — Usuários ativos agora
// =====================================================

import { NextResponse } from 'next/server';
import { getRealtimeData, isGA4Available } from '@/lib/google-analytics';

export async function GET() {
  try {
    if (!isGA4Available()) {
      return NextResponse.json({ success: true, data: { activeUsers: 0, pages: [] } });
    }

    const data = await getRealtimeData();
    return NextResponse.json({ success: true, data: data || { activeUsers: 0, pages: [] } });
  } catch (error) {
    console.error('❌ GA4 Realtime Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    );
  }
}
