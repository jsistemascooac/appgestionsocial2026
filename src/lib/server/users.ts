export type User = { id: string; email: string; password: string; role: string; name?: string };

// Mock users for demo purposes. Replace with DB lookup and hashed passwords.
const USERS: User[] = [
  { id: '1', email: 'admin@example.com', password: 'adminpass', role: 'admin', name: 'Admin' },
  { id: '2', email: 'user@example.com', password: 'userpass', role: 'tenant', name: 'Tercero' }
];

export async function verifyCredentials(email: string, password: string) {
  const u = USERS.find((x) => x.email === email && x.password === password);
  return u ?? null;
}
