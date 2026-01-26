import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-this';

function sign(payload: Record<string, any>) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const hmac = crypto.createHmac('sha256', SECRET).update(data).digest('base64');
  return `${data}.${hmac}`;
}

function verify(token?: string | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  const payload = JSON.parse(Buffer.from(data, 'base64').toString());
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

export function createToken({ id, role, name, maxAge = 60 * 60 * 24 }: { id: string; role: string; name?: string; maxAge?: number }) {
  const payload = { id, role, name, exp: Date.now() + maxAge * 1000 };
  return sign(payload);
}

export function verifyToken(token?: string | null) {
  return verify(token as string | undefined);
}

export type UserPayload = { id: string; role: string; name?: string; exp?: number } | null;
