# Histórico de Decisões Arquiteturais (ADRs) — SocialCraft Studio

### ADR-001: Isolamento Rigoroso de Metadados por Canal no Buffer
- **Data:** 2026-11-08
- **Contexto:** A API do Buffer rejeita payloads de publicação com erro HTTP 400 quando o payload enviado para canais do tipo `linkedin` contém o objeto `metadata.instagram`.
- **Decisão:** O módulo `src/app/api/buffer/schedule/route.ts` deve segregar estritamente os metadados: apenas anexar `metadata.instagram` para canais com `service === 'instagram'`. Para LinkedIn, enviar sem o objeto conflitante.

### ADR-002: Auto-renovação de Token OAuth do Buffer via Refresh Token
- **Data:** 2026-11-08
- **Contexto:** Tokens de acesso da API do Buffer expiram a cada 3600 segundos (1 hora). Sem renovação, todas as chamadas falham após 1h.
- **Decisão:** Criação de `src/lib/buffer-auth.ts` que monitora `expires_at` e executa refresh automático contra `https://api.bufferapp.com/1/oauth2/token.json` usando `BUFFER_REFRESH_TOKEN` e `BUFFER_CLIENT_ID`.

### ADR-003: Renderização Dinâmica sem conflito com Turbopack Cache
- **Data:** 2026-11-08
- **Contexto:** Usar `export const dynamic = "force-dynamic"` quebra o build no Next.js 16 com Turbopack na Vercel quando `cacheComponents` está ativo.
- **Decisão:** Não declarar `dynamic = "force-dynamic"`. Endpoints de leitura devem depender de requisições de rede normais com controle fino de cache HTTP ou parâmetros de URL (`timestamp`).
