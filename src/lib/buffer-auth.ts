// Utilitário para garantir que sempre haja um access token válido do Buffer
// Se expirar (1h), renova automaticamente usando o refresh_token

let inMemoryToken: {
  accessToken: string;
  expiresAt: number;
} | null = null;

export async function getValidBufferToken(): Promise<string | null> {
  const envAccessToken = process.env.BUFFER_ACCESS_TOKEN;
  const refreshToken = process.env.BUFFER_REFRESH_TOKEN;
  const clientId = process.env.BUFFER_CLIENT_ID || "39a9dca5-3edf-4dd9-bc3f-910740a7e333";

  // Se já temos um em memória válido por mais de 5 minutos, usa ele
  if (inMemoryToken && Date.now() < inMemoryToken.expiresAt - 300000) {
    return inMemoryToken.accessToken;
  }

  // Tenta testar o token atual
  if (envAccessToken) {
    try {
      const testRes = await fetch("https://mcp.buffer.com/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          Authorization: `Bearer ${envAccessToken}`
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: {
            name: "get_account",
            arguments: {}
          }
        })
      });

      const testData = await testRes.json();
      if (!testData.error) {
        inMemoryToken = {
          accessToken: envAccessToken,
          expiresAt: Date.now() + 3000000 // 50 min
        };
        return envAccessToken;
      }
    } catch (e) {
      console.warn("Token atual falhou no teste, tentando refresh:", e);
    }
  }

  // Se falhou ou expirou, tenta dar refresh usando o refreshToken
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
        inMemoryToken = {
          accessToken: refreshData.access_token,
          expiresAt: Date.now() + (refreshData.expires_in || 3600) * 1000
        };
        console.log("Buffer token renovado com sucesso!");
        return refreshData.access_token;
      }
    } catch (err) {
      console.error("Falha ao renovar token do Buffer:", err);
    }
  }

  return envAccessToken || null;
}
