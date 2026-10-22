# JobFinder — Front-end MVP

Front-end React + TypeScript + Vite de uma plataforma de busca e monitoramento de vagas.

## Requisitos
- Node.js 22.22+ recomendado
- npm

## Executar
```bash
npm install
npm run dev
```

## Demonstração
- Login: `demo@jobfinder.local`
- Senha: `JobFinder123`

Este MVP não possui backend, banco de dados, autenticação real, pagamentos ou APIs externas.
O `localStorage` simula persistência local.

## Pontos de integração futura
- `src/services/authService.ts` → API de autenticação
- `src/services/jobService.ts` → API/agregador de vagas
- `src/services/storageService.ts` → persistência remota
- `src/types/index.ts` → contratos compartilhados
