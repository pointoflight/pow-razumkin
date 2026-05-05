'use server';

import { cookies } from 'next/headers';

const INTERNAL_URL = process.env.INTERNAL_API_URL || 'http://api:3011';

export async function serverFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; pagination?: unknown }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers['Cookie'] = `auth_token=${token}`;

  try {
    const res = await fetch(`${INTERNAL_URL}${path}`, {
      ...init,
      headers,
      cache: 'no-store',
    });
    return res.json();
  } catch {
    return { success: false, error: 'Network error' };
  }
}
