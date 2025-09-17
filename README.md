# BiteSync — app de monitoramento clínico (landing + painel)

Este repositório contém a interface web do BiteSync: uma landing page interativa e um painel voltado para profissionais de saúde que utilizam o dispositivo BiteSync para coleta e visualização de leituras.

Resumo rápido
- Framework: Next.js (App Router)
- UI: React 19 + Tailwind CSS
- Animações/UX: Framer Motion
- UI primitives: Radix UI
- Backend-as-a-Service: Supabase (@supabase/supabase-js)
- Hospedagem recomendada: Vercel

Stack e dependências principais
- next (Next.js) — App Router
- react / react-dom (React 19)
- tailwindcss (v4)
- framer-motion (animações)
- @supabase/supabase-js (client)
- @radix-ui/* (componentes acessíveis)
- @paper-design/shaders-react (fundo shader)

Scripts úteis (definidos em `package.json`)
- dev: `pnpm dev` — roda o servidor em modo de desenvolvimento
- build: `pnpm build` — build para produção
- start: `pnpm start` — inicia a versão construída
- lint: `pnpm lint`

Pré-requisitos
- Node.js 18+ recomendado
- pnpm (recomendado) ou npm/yarn

Instalação local
1. Clone o repositório

```bash
git clone git@github.com:guipm2/bitesync-app.git
cd bitesync-app
```

2. Instale dependências

```bash
pnpm install
# ou
npm install
# ou
yarn install
```

Variáveis de ambiente (IMPORTANTE)
- Não comite variáveis de ambiente com segredos. Nunca envie arquivos `.env.local` ou `.env` para o repositório.
- Há um arquivo `./.env.example` com as chaves/nomes esperados. Copie esse arquivo e preencha as variáveis no seu ambiente local:

```bash
cp .env.example .env.local
# editar .env.local com valores reais (ex: SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY, etc.)
```

- As variáveis `NEXT_PUBLIC_...` são expostas ao cliente (use apenas valores públicos lá). Chaves sensíveis (service role, secret keys) devem ficar apenas em variáveis sem o prefixo `NEXT_PUBLIC_` e em ambientes server-side.
- O repositório já inclui `.gitignore` que ignora arquivos `.env*` para evitar commits acidentais.

Rodando em desenvolvimento

```bash
pnpm dev
# por padrão abrirá em http://localhost:3000 (ou outra porta se 3000 estiver em uso)
```

Build e execução em produção (local)

```bash
pnpm build
pnpm start
```

Notas sobre arquitetura
- A landing page usa um contêiner de scroll interno (desktop) com navegação programática entre seções.
- O projeto usa componentes client/server do Next.js App Router; verifique os arquivos em `app/` para entradas e rotas.
- O componente `components/ui/motion-button.tsx` é o primitivo de botão com animação (Framer Motion) — usamos ele para garantir comportamento consistente (não permitir seleção de texto, animações, e comportamento de link/button uniforme).

Supabase
- Variáveis esperadas (exemplos presentes em `.env.example`):
  - SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL
  - SUPABASE_KEY / NEXT_PUBLIC_SUPABASE_KEY / SUPABASE_ANON_KEY

Deploy
- Recomendamos usar Vercel para deploy contínuo (integração com GitHub). Configure as variáveis de ambiente no painel do Vercel (project settings) — aí sim você pode usar as chaves privadas no ambiente de produção.

Contribuindo
- Para mudanças maiores faça um branch, escreva commits atômicos e abra uma PR descrevendo as mudanças.

Problemas comuns
- Se o dev server não iniciar, verifique se a porta 3000 está em uso. O Next.js pode trocar de porta automaticamente.
- Se a autenticação Supabase falhar localmente, confirme as variáveis em `.env.local` e verifique a URL/KEY.

Contato
- Para dúvidas sobre este repositório, abra uma issue ou entre em contato.
