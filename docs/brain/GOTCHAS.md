# Armadilhas Conhecidas & Lições Aprendidas (Gotchas)

### 1. Buffer API & Mídias
- **URLs Requeridas:** O Buffer exige URLs públicas e válidas (`https://...`) para o campo `media.video` ou `media.photo`. Arquivos locais (`file:///` ou `/samples/...` relativos) falham no processamento de mídia do Buffer.
- **Isolamento de Redes:** Nunca enviar chaves de metadados do Instagram para o canal do LinkedIn ou Twitter. O validador do Buffer rejeita imediatamente.

### 2. Vercel Build & Runtimes
- **Versão do Node.js:** Node.js `26.x` é descontinuado na Vercel e causa abort de build imediato. Fixar sempre em `24.x` no `package.json` (`engines.node: "24.x"`) e em `.vercel/project.json`.

### 3. Canvas & PDF no Navegador
- **jsPDF / Html2Canvas:** Exportação de carrosséis deve renderizar cada slide individualmente na resolução exata de 1080x1080px (ou 1080x1350px para posts retrato) para evitar blur de DPI e quebra de fontes web.
