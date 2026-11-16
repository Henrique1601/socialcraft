import { cookies } from "next/headers";

// Utilitário para garantir que sempre haja um access token válido do Buffer.
// Prioriza: 1) Cookie HttpOnly salvo pelo usuário na UI, 2) Cache em memória, 3) Env var, 4) Refresh token.

let inMemoryToken: {
  accessToken: string;
  expiresAt: number;
} | null = null;

export async function verifyBufferToken(token: string): Promise<{
  valid: boolean;
  account?: { id: string; name: string; email: string };
  error?: string;
}> {
  try {
    const res = await fetch("https://mcp.buffer.com/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "get_account", arguments: {} }
      })
    });

    if (!res.ok) {
      return { valid: false, error: `HTTP ${res.status}: Token inválido ou expirado` };
    }

    const data = await res.json();
    if (data?.error) {
      return { valid: false, error: data.error.message || "Token inválido" };
    }

    const rawText = data?.result?.content?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return {
        valid: true,
        account: {
          id: parsed.id,
          name: parsed.name,
          email: parsed.email
        }
      };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err?.message || "Erro ao validar token" };
  }
}

export function setInMemoryBufferToken(accessToken: string, expiresInSeconds = 3600) {
  inMemoryToken = {
    accessToken,
    expiresAt: Date.now() + expiresInSeconds * 1000
  };
}

export async function getValidBufferToken(): Promise<string | null> {
  // 1. Verifica cookie salvo pela interface (não quebra durante prerender estático)
  try {
    const cookieStore = await cookies();
    const userCookieToken = cookieStore.get("buffer_access_token")?.value;
    if (userCookieToken) {
      return userCookieToken;
    }
  } catch {
    // Contexto sem request/cookies (ex: build time)
  }

  // 2. Cache em memória válido por mais de 5 minutos
  if (inMemoryToken && Date.now() < inMemoryToken.expiresAt - 300000) {
    return inMemoryToken.accessToken;
  }

  const envAccessToken = process.env.BUFFER_ACCESS_TOKEN;
  const refreshToken = process.env.BUFFER_REFRESH_TOKEN;
  const clientId = process.env.BUFFER_CLIENT_ID || "39a9dca5-3edf-4dd9-bc3f-910740a7e333";

  // 3. Testa o token da variável de ambiente
  if (envAccessToken) {
    const check = await verifyBufferToken(envAccessToken);
    if (check.valid) {
      setInMemoryBufferToken(envAccessToken, 3000);
      return envAccessToken;
    }
  }

  // 4. Tenta refresh_token caso o token de ambiente tenha expirado
  if (refreshToken) {
    try {
      const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId
      });

      const refreshRes = await fetch("https://auth.buffer.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
      });

      const refreshData = await refreshRes.json();
      if (refreshData.access_token) {
        setInMemoryBufferToken(refreshData.access_token, refreshData.expires_in || 3600);
        return refreshData.access_token;
      }
    } catch {
      // Silencioso no build; a rota reportará o erro de conexão real
    }
  }

  return null;
}
