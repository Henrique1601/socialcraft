# Changelog

Todas as alterações notáveis do **SocialCraft Studio** são documentadas neste arquivo.

## [0.2.0] - 2026-11-16
### Added
- **Buffer OAuth2 PKCE + Token UI:** Fluxo `/api/auth/buffer/login` e `/api/auth/buffer/callback` com PKCE `S256` e persistência em cookies `HttpOnly`, além de campo para reconectar o Access Token direto na UI (`/api/buffer/token`).
- **Importador de URL & GitHub Live:** Endpoints `/api/import-url` (extração de título, meta description e cor de tema), `/api/capture-screenshot` (Microlink/mShots) e `/api/import-github` com sincronização ao vivo dos repositórios.
- **Gravador Real de Vídeo 9:16 no Browser (`CanvasMotionRecorder`):** Renderização em HTML5 Canvas para os 10 estilos visuais do catálogo, barra de frase em destaque, narração em voz PT-BR (`SpeechSynthesis`), exportação `.webm` e upload via `/api/upload-media`.
- **Seletor Instagram & Ação no Buffer:** Escolha direta entre `Reels`, `Story` e `Feed` + `Fila`, `Publicar Agora` ou `Rascunho`.
- **Carrossel Bento Multi-Slide:** Exportação de slides individuais em PNG (`1080x1080`) e carrossel completo em PDF para LinkedIn (`BentoCarouselViewer`).
- **Analytics & Buffer Live Honestos:** Painel `/api/analytics` consultando os 3 canais em paralelo e tratamento explícito de falhas de autenticação na esteira `ScheduleCalendar`.

### Fixed
- Removidos placeholders (`big_buck_bunny.mp4` e imagens genéricas) do `asset-catalog.ts`.
- Corrigida falsa confirmação `"Sincronizado com Mídia"` quando o Buffer retornava `401 Unauthorized`.

## [0.1.0] - 2026-11-08
### Added
- Versão inicial do SocialCraft Studio com Next.js 16, React 19, Turbopack e integração inicial com Buffer MCP.
