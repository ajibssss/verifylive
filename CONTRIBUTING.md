# 🤝 Contribuindo para o VerifyLive

Primeiro, obrigado por considerar contribuir para o VerifyLive! Estamos construindo o futuro da segurança biométrica com Gemini 3.

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 15 (App Router), TailwindCSS, MediaPipe.
- **Backend:** Supabase (Auth, DB, Storage, Edge Functions).
- **AI:** Google Vertex AI (Gemini 3 Pro/Flash).

## 📐 Fluxo de Desenvolvimento (GitFlow)

1. **Fork** o repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
   - ⚠️ **Importante:** Nunca commite direto na `main` ou `develop`.
3. Certifique-se de que o **Husky** está rodando (validação de commits).
   - Padrão: `feat: add liveness detection`, `fix: camera permission error`.
4. Abra um **Pull Request** apontando para a branch `develop`.

## 🧪 Testes e Qualidade

Antes de enviar seu PR:

- Rode `npm run lint` para verificar estilo.
- Teste a câmera em pelo menos um dispositivo móvel se tocar no MediaPipe.

## ⚖️ Regras de Ouro (Hackathon)

1. **Zero Keys:** Nunca suba arquivos `.env` ou chaves hardcoded.
2. **Compliance:** Qualquer mudança que envolva dados de usuário deve respeitar o TTL de 24h (LGPD).
3. **Audit:** Mantenha os logs de auditoria intactos.

Dúvidas? Abra uma Issue com a label `question`.

Happy Hacking! 🚀
