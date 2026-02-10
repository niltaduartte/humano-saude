import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PYTHON_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/health
 * Health check consolidado de todos os serviços
 */
export async function GET() {
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

  // 1. Supabase
  const supaStart = Date.now();
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabase.from('insurance_leads').select('id').limit(1);
    checks.supabase = {
      status: error ? 'degraded' : 'healthy',
      latency: Date.now() - supaStart,
      ...(error ? { error: error.message } : {}),
    };
  } catch (err) {
    checks.supabase = {
      status: 'down',
      latency: Date.now() - supaStart,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }

  // 2. Python Backend
  const pyStart = Date.now();
  try {
    const resp = await fetch(`${PYTHON_API}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await resp.json();
    checks.python_backend = {
      status: data.status === 'healthy' ? 'healthy' : 'degraded',
      latency: Date.now() - pyStart,
    };
  } catch (err) {
    checks.python_backend = {
      status: 'down',
      latency: Date.now() - pyStart,
      error: err instanceof Error ? err.message : 'Unreachable',
    };
  }

  // 3. Next.js (always healthy if we got here)
  checks.nextjs = { status: 'healthy', latency: 0 };

  // Overall status
  const allHealthy = Object.values(checks).every((c) => c.status === 'healthy');
  const anyDown = Object.values(checks).some((c) => c.status === 'down');

  const overall = allHealthy ? 'healthy' : anyDown ? 'degraded' : 'partial';

  return NextResponse.json({
    status: overall,
    timestamp: new Date().toISOString(),
    services: checks,
  });
}
